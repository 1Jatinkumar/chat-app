import jwt from 'jsonwebtoken'
import { ConsoleLog } from '../utils/console.util.js';

export const AccessTokenValidator = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        let token = authorization.split("Bearer ")[1];
        const tokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = tokenData;
    } catch (error) {
        ConsoleLog('error', 'middleware/AccessTokenValidator: invalid token', error);
        return res.status(401).json({ msg: 'Unauthorized access' });
    }
    next()
}