import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    const { email, password } = req.body;
    const { ip } = req;

    try {
        let doc = await userModel.findOne({ email }).lean();
        if (doc) {
            res.status(409).json({ error: 'Email is exist' });
        } else {
            doc = await userModel.create({ email, password, ip }).lean();
            res.status(201).json({ data: doc });
        }
    } catch (error) {
        ConsoleLog('error', 'unable to create user', error);
        res.status(500).json({ error: { message: 'Internal server error' } })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user.length == 0) {
            res.status(401).json({ error: 'email not found' });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const accessToken = jwt.sign({ id: user._id, email }, process.env.ACCESS_TOKEN_SECRET);
                const refrshToken = jwt.sign({ id: user._id, email }, process.env.REFRESH_TOKEN_SECRET);

                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    path: '/api',
                    maxAge: 5 * 60 * 1000, // for 5 mint 
                });
                res.cookie('refreshToken', refrshToken, {
                    httpOnly: true,
                    path: '/api',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // for 7 days 
                });
                user.refreshToken = refrshToken;
                user.save();
                res.status(200).json(user);
            } else {
                res.status(401).json({ error: 'incorrect password' });
            }
        }
    } catch (error) {
        ConsoleLog('error', 'unable to find user for login', error);
        res.status(500).json({ error: { message: 'Internal server error' } })
    }

}

export const forgotPassword = async (req, res) => {
    
}