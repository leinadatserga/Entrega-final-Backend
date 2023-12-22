import { Router } from 'express';
import { deleteUser, getUsers, postUserDocuments, postUserRol, sendRecoveryMail, verifyRecoveryLink } from '../controllers/users.controller.js';
import { passportError, authorization } from '../utils/errors.js';
import multer from 'multer';

const storageDocs = multer.diskStorage ({
    destination: ( req, file, cb ) => {
        cb ( null, "src/public/documents" )
    },
    filename: ( req, file, cb ) => {
        cb ( null, `${ file.originalname }${ Date.now () }`)
    }
})
const userDocuments = multer ({ storage: storageDocs })

const routerUsers = Router ();
routerUsers.get ( "/", passportError ( "jwt" ), authorization ( "admin" ), getUsers );
routerUsers.delete ( "/:uid", passportError ( "jwt" ), authorization ( "admin" ), deleteUser );
routerUsers.post ( "/:uid/documents", passportError ( "jwt" ), authorization ([ "user", "premium" ]), userDocuments.single ( "document" ), postUserDocuments );
routerUsers.post ( "/premium/:uid", passportError ( "jwt" ), authorization ( "admin" ), postUserRol );
routerUsers.post ( "/sendpassreset", sendRecoveryMail );
routerUsers.post ( "/verify/:token", verifyRecoveryLink );

export default routerUsers;