import { userModel } from "../models/user.model.js";
import { ConsoleLog } from "../utils/console.util.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { senitizeUser } from "../utils/sanitizer.util.js";
import { genrateJWTtokens } from "../utils/common.util.js";

export const register = async (req, res) => {
    const { email, password, name, city, country } = req.body;
    const { ip } = req;

    try {
        let doc = await userModel.findOne({ email }).lean();
        if (doc) {
            return res.status(409).json({ errors: [{ path: "email", msg: 'Email is exist' }] });
        } else {
            let newUser = await userModel.create({ email, password, ip, name, city, country });
            const senitizedUser = senitizeUser(newUser);
            return res.status(201).json(senitizedUser);
        }
    } catch (error) {
        ConsoleLog('error', 'unable to create user', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ errors: [{ path: 'email', msg: 'Email not found' }] });
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                const { accessToken, refreshToken } = genrateJWTtokens({ id: user._id, email });
                // save refreshToken in DB
                user.refreshToken = refreshToken;
                user.save();

                // set refresh token in cookies
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    path: '/api/auth/refresh',
                    secure: process.env.ENVIRONMENT == 'prod',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                // send accesToken to frontend so that then can sent in headers
                user.accessToken = accessToken;
                const senitizedUser = senitizeUser(user);
                return res.status(200).json(senitizedUser);
            } else {
                return res.status(401).json({ error: 'incorrect password' });
            }
        }
    } catch (error) {
        ConsoleLog('error', 'unable to find user for login', error);
        return res.status(500).json({ error: { message: 'Internal server error' } })
    }

}


export const authRefresh = async (req, res) => {
    if (!req.cookies || !req.cookies.refreshToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        const { refreshToken } = req.cookies;
        let tokenData;
        try {
            tokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: "lax",
                path: '/api/auth/refresh',
                secure: process.env.ENVIRONMENT == 'prod',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(401).json({ error: error.message });
        }

        const user = await userModel.findOne({ refreshToken }, { refreshToken: 0, ip: 0, password: 0 }).lean();
        return res.status(200).json({ data: user });
    }
}

export const forgotPassword = async (req, res) => {

}