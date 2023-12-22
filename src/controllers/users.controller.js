import config from "../config/config.js";
import userModel from "../models/users.models.js";
import CustomError from "../services/errors/CustomError.js";
import crypto from "crypto";
import { mailSender } from "../config/mailer.js";
import { createHash } from "../utils/bcrypt.js";
import logger from "../utils/logger.js";


const tokenLink = {};
export const getUsers = async ( req, res ) => {
    try {
        const users = await userModel.find ();
        return res.status ( 200 ).send ( users );
    } catch ( error ) {
        logger.warning ( `[ ERROR ] [ ${ new Date ().toLocaleString () } ] Ha ocurrido un error: ${ error.message }` );
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const postUser = async ( req, res ) => {
    try {
        if ( !req.user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        res.status ( 201 ).send ({ message: "User created", user: req.user });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const deleteUser = async ( req, res ) => {
    const { uid } = req.params;
    try {
        const user = await userModel.findById ( uid );
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        await userModel.findByIdAndDelete ( uid );
        res.status ( 200 ).send ({ message: "User deleted", user: req.user });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const postUserRol = async ( req, res ) => {
    const { uid } = req.params;
    try {
        const user = await userModel.findById ( uid );
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        const rol = user.rol;
        rol == "user" ? user.rol = "premium" : user.rol = "user";
        await userModel.findByIdAndUpdate( uid, { rol: user.rol });
        res.status ( 200 ).send ({ message: "Rol updated", user: user });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const sendRecoveryMail = async ( req, res ) => {
    const { email } = req.body;
    const user = await userModel.findOne ({ email: email });
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        } else {
            logger.debug ( "User finded!" );
        }
    try {
        const token = crypto.randomBytes ( 20 ).toString ( "hex" );
        tokenLink [ token ] = { email, timestamp: Date.now ()};
        const link = `http://${ config.host }:${ config.port }/api/users/verify/${ token }`;
        mailSender ( email, link );
        res.status ( 200 ).send ({ message: "Recovery email sent" });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};

export const verifyRecoveryLink = async ( req, res ) => {
    const { token } = req.params;
    const { password } = req.body;
    const verifiedLink = tokenLink [ token ];
    const { email } = verifiedLink;
    const newPassword = createHash ( password );
    const user = await userModel.findOne ({ email: email });
        if ( user.password == newPassword ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        } else {
            logger.debug ( "User finded!" );
        }
    try {
        if ( verifiedLink && ( Date.now () - verifiedLink.timestamp ) <= 3600000 ) {
            await userModel.findOneAndUpdate({ email: email }, { password: newPassword }, { new: true });
            delete tokenLink [ token ];
            res.status ( 200 ).send ({ message: "Recovery email verify, new password set confirmed" });
        } else {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const postUserDocuments = async ( req, res ) => {
    const { uid } = req.params;
    try {
        const user = await userModel.findById ( uid );
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        const document = [{name: req.file.originalname, reference: req.file.destination}];
        await userModel.findByIdAndUpdate ( uid, {documents: document});
        user.save ();
        res.status ( 200 ).send ({ message: "Document upload successfully", doc: req.file.path });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};