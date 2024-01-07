import config from "./config.js";
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";


export const mailSender = ( email, link ) => {
    const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
        authMethod: 'LOGIN'
    }
});
    const mailConf = {
        from: 'TEST Daniel Agresta leinadatserga2@gmail.com',
        to: email,
        subject: 'Saludo de buenos dias',
        html:
            `
            <div>
                <h1> Hola, ¿Cómo estás ${ email }? </h1>
                <button><a href="${ link }">Reset Password</a></button>
            </div>
            `
    }
    transporter.sendMail( mailConf, ( error, info ) => {
        if ( error )
            logger.debug ( error );
        else
            logger.debug ( `Password recovery email successfully sent to ${ info.envelope.to } Link: ${ link }` );
    })
};
