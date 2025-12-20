import jwt from 'jsonwebtoken'

export const genrateJWTtokens = (obj) => {
    const accessToken = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}