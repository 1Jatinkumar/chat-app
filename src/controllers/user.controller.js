import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find();
        res.status(200).json({ data: users });
    } catch (error) {
        ConsoleLog('error', 'api/auth: unable to find users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        res.status(200).json({ data: user });
    } catch (error) {
        ConsoleLog('error', 'api/auth: unable to find by id', error);
        res.status(500).json({ error: 'Internal server Error' });
    }
}