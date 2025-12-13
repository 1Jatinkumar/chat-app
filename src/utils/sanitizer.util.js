export const senitizeUser = (user) => {
    let senitizedUser = user.toObject();
    delete senitizedUser.password;
    delete senitizedUser.refreshToken;
    delete senitizedUser.ip;
    delete senitizedUser.__v;

    return senitizedUser
}