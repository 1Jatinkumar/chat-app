import { messageModel } from "../models/message.model.js";
import { ConsoleLog } from "../utils/console.util.js";

export const sendMessage = async (req, res) => {
    const { sender, reciever, message } = req.body;

    try {
        const doc = await messageModel.create({ sender, reciever, message });
        res.status(201).json({ doc });
    } catch (error) {
        ConsoleLog('error', 'unable to add message', error);
        res.status(500).json({ error: { message: 'Internal server error' } })
    }
}

export const sendFile = async (req, res) => {
    let { isPrivate } = req.body;
    res.status(200).json({ success: true })
}

export const getMessages = async (req, res) => {
    try {
        const allMessages = await messageModel.find();
        res.status(200).json(allMessages)
    } catch (error) {

    }
}