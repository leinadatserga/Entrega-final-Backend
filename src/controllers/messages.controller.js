import messageModel from "../models/messages.models.js";
import CustomError from "../services/errors/CustomError.js";
import logger from "../utils/logger.js";

export const getMessages = async ( req, res ) => {
    try {
        const messages = await messageModel.find ();
        return res.status ( 200 ).send ( messages );
    } catch ( error ) {
        logger.warning ( `[ ERROR ] [ ${ new Date ().toLocaleString () } ] Ha ocurrido un error: ${ error.message }` );
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const getMessageByMail = async ( req, res ) => {
    const { email } = req.params;
    try {
        const findMessage = await messageModel.findOne ({ email });
        if ( findMessage ) {
            const message = await messageModel.find ({ email });
            return res.status ( 200 ).send ( message );
        } else {
            return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
        }
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const postMessage = async ( req, res ) => {
    const { email, message } = req.body;
    try {
        const newMessage = await messageModel.create ({ email, message });
        return res.status ( 200 ).send ( newMessage );
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const deleteMessage = async ( req, res ) => {
    const { email } = req.params;
    try {
        const deletedMessages = await messageModel.findOneAndDelete ( email );
        if ( deletedProduct ) {
            return res.status ( 200 ).send ( deletedMessages );
        } else {
            return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
        }
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};