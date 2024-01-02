import { Router } from 'express';
import { getMessages, getMessageByMail, postMessage, deleteMessage } from '../controllers/messages.controller.js';
import { passportError, authorization } from '../utils/errors.js';
import { requestLogger } from '../middlewares/requestLogger.js';

const routerMessages = Router ();
routerMessages.get ( "/", passportError ( "jwt" ), requestLogger, authorization ([ "user", "premium" ]), getMessages );
routerMessages.get ( "/:email", passportError ( "jwt" ), authorization ( "admin" ), getMessageByMail );
routerMessages.post ( "/", passportError ( "jwt" ), authorization ([ "user", "premium" ]), postMessage );
routerMessages.delete ( "/:email", passportError ( "jwt" ), authorization ( "admin" ), deleteMessage );

export default routerMessages;