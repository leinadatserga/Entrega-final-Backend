import config from "../config/config.js";
import jwt from "jsonwebtoken";

export const generateToken = ( user ) => {
    const token = jwt.sign ({ user }, config.JWTSecret, { expiresIn: "12h" });
    return token;
};
export const authToken = ( req, res, next ) => {
    const authHeader = req.headers.Authorization;
    if ( !authHeader ) {
        return res.status ( 401 ).send ({ error: "User not autenticated"});
    }
    const token = authHeader.split (" ")[ 1 ];
    jwt.sign ( token, config.JWTSecret, ( error, credentials ) => {
        if ( error ) {
            return res.status ( 403 ).send ({ error: "Unauthorized user"});
        }
        req.user = credentials.user;
        next ();
    })
};
