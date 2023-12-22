import passport from "passport";

export const passportError = ( strategy ) => {
    return async ( req, res, next ) => {
        passport.authenticate ( strategy, ( error, user, info ) => {
            if ( error ) {
                return next ( error );
            }
            if ( !user ) {
                return res.status ( 401 ).send ({ error: info.messages ? info.messages : info.toString ()});
            }
            req.user = user;
            next ();
        }) ( req, res, next );
    }
};
export const authorization = ( rol ) => {
    return async ( req, res, next ) => {
        if ( !req.user ) {
            return res.status ( 401 ).send ({ error: "Unauthorized user"});
        }
        if ( !rol.includes ( req.user.user.rol )) {
            return res.status ( 403 ).send ({ error: "Access denied. User don't have the necessary privileges"});
        }
        next ();
    }
};
