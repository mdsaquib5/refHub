// import jwt from "jsonwebtoken";

// export const generateAccessToken = (userId) => {
//     return jwt.sign(
//         { userId },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
//     );
// }

// export const generateRefreshToken = (userId) => {
//     return jwt.sign(
//         { userId },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
//     );
// }

import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};