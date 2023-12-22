import { Router } from 'express';
import passport from 'passport';
import { passportError } from '../utils/errors.js';
import { postSession, getJWT, getCurrent, getGithub, getGithubSession, getLogOut } from '../controllers/sessions.controller.js';
import { postUser } from '../controllers/users.controller.js';

const routerSession = Router ();
routerSession.post ( "/login", passport.authenticate ( "login" ), postSession );
routerSession.post ( "/register", passport.authenticate ( "register" ), postUser );
routerSession.get ( "/testjwt", passport.authenticate ( "jwt", { session: false }), getJWT );
routerSession.get ( "/current", passportError ( "jwt" ), getCurrent );
routerSession.get ( "/github", passport.authenticate ( "github", { scope: [ "user: email" ]}), getGithub );
routerSession.get ( "/githubSession", passport.authenticate ( "github" ), getGithubSession );
routerSession.get ( "/logout", getLogOut );

export default routerSession;