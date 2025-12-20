import { connectionModel } from "../models/connections.model.js";
import { requestsModel } from "../models/requests.model.js";
import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, { password: 0, ip: 0, __v: 0 }).lean();
        return res.status(200).json({ data: users });
    } catch (error) {
        ConsoleLog('error', 'api/auth: unable to find users', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id).lean();
        return res.status(200).json({ data: user });
    } catch (error) {
        ConsoleLog('error', 'api/auth: unable to find by id', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }
}

export async function getUserByEmail(email) {
    return await userModel.findOne({ email }).lean();
}


export const searchUser = async (req, res) => {
    const { id, email } = req.user;
    let { q, by } = req.body;

    let newParams = {};
    if (by == 'name') {
        newParams = { name: { $regex: q, $options: "i" } };
    } else if (by == 'email') {
        newParams = { email: { $regex: q, $options: "i" } };
    }

    let users = [];
    try {
        users = await userModel.find({ ...newParams, _id: { $ne: id } }, { password: 0, ip: 0, __v: 0 }).lean();
    } catch (error) {
        ConsoleLog('error', 'user/search: unable to find users', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }

    // get request status
    const UpdatedUser = await Promise.all(
        users.map(async (user) => {
            const UpdatedUser = {
                ...user,
                requestType: null
            };

            let outgoingRequests = [];
            let incomingRequests = [];
            try {
                outgoingRequests = await requestsModel.find({ from: id, to: user._id, type: "DM", status: null }).lean();
                incomingRequests = await requestsModel.find({ from: user._id, to: id, type: "DM", status: null }).lean();
            } catch (error) {
                ConsoleLog('error', 'user/search: unable to user requests status', error);
            }

            if (outgoingRequests.length != 0) {
                UpdatedUser.requestType = "outgoing"
            }
            if (incomingRequests.length != 0) {
                UpdatedUser.requestType = "incoming"
            }
            if (outgoingRequests.length == 0 && incomingRequests.length == 0) {
                const isConnected = await connectionModel.countDocuments({ type: "DM", members: { $all: [id, user._id] } });
                if (isConnected == 1) {
                    UpdatedUser.requestType = "accepted"
                }
            }
            return UpdatedUser
        })
    )
    return res.status(200).json(UpdatedUser);
}