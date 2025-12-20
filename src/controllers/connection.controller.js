import { connectionModel } from "../models/connections.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export const createConnection = async (req, res) => { }

export const getAllConnections = async (req, res) => {
    const { type } = req.query;
    try {
        const connections = await connectionModel.find({ members: { $in: [req.user.id] }, type: type }).lean();
        return res.status(200).json(connections);
    } catch (error) {
        ConsoleLog('error', 'Unable to fetch connections', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}