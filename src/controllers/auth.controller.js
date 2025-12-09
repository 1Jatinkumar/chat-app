import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export const createUser = async (req, res) => {
    const { email } = req.body;
    const ip = req.ip;

    try {
        let doc = await userModel.findOne({ email });
        if (doc) {
            res.status(400).json({ error: 'Email is exist' });
        } else {
            doc = await userModel.create({ email, ip });
            res.status(201).json({ data: doc });
        }
    } catch (error) {
        ConsoleLog('error', 'unable to create user', error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

export const login = async (req, res) => {
}

export const forgotPassword = async (req, res) => {
}