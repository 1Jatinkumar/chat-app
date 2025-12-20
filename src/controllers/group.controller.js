import { connectionModel } from "../models/connections.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export const getGroupsByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userConnections = await connectionModel.find({ type: "group", members: { $in: [id] } });
        res.status(200).json(userConnections)
    } catch (error) {
        ConsoleLog('error', 'Fetching groups failed', error);
        res.status(500).json({ msg: "Something went wrong please try again" });
    }
}