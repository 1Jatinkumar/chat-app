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
    const { searchType, ...params } = req.body;
    try {
        if (searchType == 'or') {
            // converting each properties of an object into individual array of objects
            const newParams = Object.entries(params).map((arrItem) => {
                return Object.fromEntries([arrItem]);
            });

            const users = await userModel.find({ $or: newParams }, { password: 0, ip: 0, __v: 0 }).lean();
            return res.status(200).json({ data: users });
        } else {
            const users = await userModel.find(params, { password: 0, ip: 0, __v: 0 }).lean();
            return res.status(200).json({ data: users });
        }
    } catch (error) {
        ConsoleLog('error', 'user/search: unable to find users', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }

}


export const handleUserRequest = async (req, res) => {
    const { accessToken } = req.cookies;
}