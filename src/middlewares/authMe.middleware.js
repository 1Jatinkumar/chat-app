import jwt from 'jsonwebtoken'

export const authMe = async (req, res, next) => {
    // verify accessToken from header only
    next()
}