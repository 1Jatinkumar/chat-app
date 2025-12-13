import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { senitizeUser } from "../utils/sanitizer.util.js";

export const createUser = async (req, res) => {
    const { email, password, name, city, country } = req.body;
    const { ip } = req;

    try {
        let doc = await userModel.findOne({ email }).lean();
        if (doc) {
            res.status(409).json({ errors: [{ path: "email", msg: 'Email is exist' }] });
        } else {
            let newUser = await userModel.create({ email, password, ip, name, city, country });
            const senitizedUser = senitizeUser(newUser);
            res.status(201).json(senitizedUser);
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
        if (!user) {
            res.status(401).json({ errors: [{ path: 'email', msg: 'Email not found' }] });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const accessToken = jwt.sign({ id: user._id, email }, process.env.ACCESS_TOKEN_SECRET);
                const refrshToken = jwt.sign({ id: user._id, email }, process.env.REFRESH_TOKEN_SECRET);

                // create jwt
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 5 * 60 * 1000, // for 5 mint 
                });
                res.cookie('refreshToken', refrshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // for 7 days 
                });

                // save jwt in DB
                user.refreshToken = refrshToken;
                user.save();

                // prevent sensitive data before sending
                const senitizedUser = senitizeUser(user);
                res.status(200).json(senitizedUser);
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