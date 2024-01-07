import userModel from '../models/users.models.js';
import CustomError from '../services/errors/CustomError.js';
import { generateToken } from '../utils/jwt.js';

const sessionUser = (req) => {
    const { first_name, last_name, email, age } = req.user;
    req.session.user = { first_name, last_name, email, age };
}
export const postSession = async ( req, res ) => {
    try {
        if ( !req.user ) {
            return res.status ( 401 ).send ( `${ CustomError.Unauthorized ()}` );
        }
        sessionUser(req);
        const token = generateToken ( req.user );
        res.cookie ( "jwtCookie", token, {
            maxAge: 43200000
        })
        return res.status ( 200 ).send ( req.user );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const getJWT = async ( req, res ) => {
    sessionUser(req);
    return res.status ( 200 ).send ( req.user ); 
};
export const getCurrent = async ( req, res ) => {
    return res.status ( 200 ).send ( req.user );
};
export const getGithub = async ( req, res ) => {
    return res.status ( 200 ).send ( req.user );
};
export const getGithubSession = async ( req, res ) => {
    req.session.user = req.user;
    return res.status ( 200 ).send ({ message: "Active session" });
};
export const getLogOut = async ( req, res ) => {
    let userDat = {};
    if ( req.session.passport ) {
        userDat = req.session.passport.user;
        const sessionUser = await userModel.findById ( userDat );
        await sessionUser.updateLastConnection ();
        req.session.destroy ();
        return res.status ( 200 ).send ({ result: "Logout done successfully" });
    } else {
        return res.status ( 400 ).send ({ result: "No active session" });
    }
};