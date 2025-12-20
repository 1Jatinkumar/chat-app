import { connectionModel } from "../models/connections.model.js";
import { requestsModel } from "../models/requests.model.js";
import { userModel } from "../models/user.model.js";

export const getAllRequests = async (req, res) => {
    try {
        const requests = await requestsModel.find({ to: req.user.id, status: null })
            .populate('from', '_id name email profilePic')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.log('error', 'unable to fetch requests', error);
        res.status(500).json({ error: 'Something went wrong please try again after some time' })
    }
}


export const UserRequestHandler = async (req, res) => {
    const { type, from, to } = req.body;

    // validation
    const isUserToExists = await userModel.countDocuments({ _id: to });
    if (isUserToExists != 1) {
        return res.status(400).json({ error: 'Incorrect userIDs sent as to' });
    }

    if (type == "DM") {
        const isUserFromExists = await userModel.countDocuments({ _id: from });
        if (isUserFromExists != 1) {
            return res.status(400).json({ error: 'Incorrect userIDs sent as from' })
        }
    } else {
        const connection = await connectionModel.findById(from);
        if (!connection) {
            return res.status(400).json({ 'msg': 'Incorrect groupID or group not exists anymore' });
        }
    }

    // check is request is exists or not
    const checkRequest = await requestsModel.find({ from, to, type });


    if (checkRequest.length == 0) {
        // creating new request
        try {
            const request = await requestsModel.create({ from, to, type });
            res.status(201).json({ msg: 'Request is sent succefully' });
        } catch (error) {
            ConsoleLog('error', 'unable to create new request', error);
            res.status(500).json({ error: 'Something went wrong please try again after some time' })
        }
    } else {
        return res.status(400).json({ error: 'Request is already sent' });
    }
}


export const UserRequestActionHandler = async (req, res) => {
    let { action } = req.params
    const { from, to, type } = req.body;

    if (action == 'reject') {
        // rejected case
        try {
            const request = await requestsModel.findOneAndDelete({ from, to, type, status: null });
            return res.status(201).json({ msg: 'request rejected successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Something went wrong please try again after some time' })
        }
    } else if (action == 'accept') {
        // accepted case
        await requestsModel.findOneAndDelete({ from, to, type, status: null });

        switch (type) {
            case "DM":
                const connectionDM = await connectionModel.create(
                    { type: "DM", isPrivate: true, createdBy: from, admins: [from, to], members: [from, to] }
                );
                return res.status(201).json({ msg: 'request accepted successfully', data: connectionDM });
                break;
            case "group":
                const connectionGP = await connectionModel.find({ type: "group", admins: { $in: [from] } });
                connectionGP.members = [...connectionGP.members, to]
                await connectionGP.save();

                return res.status(201).json({ msg: 'request is accepted successfully', data: connectionGP });
                break;
        }
    } else {
        // unfollow case
        switch (type) {
            case "DM":
                try {
                    const connection = await connectionModel.findOneAndDelete({ type: "DM", members: { $all: [from, to] } });
                    return res.status(201).json({ msg: 'request accepted successfully' });
                } catch (error) {
                    console.log('error', 'unable to delete connection', error);
                    return res.status(500).json({ error: 'Something went wrong please try again after some time' })
                }
                break;
            case "group":
                break;
        }
    }
}
