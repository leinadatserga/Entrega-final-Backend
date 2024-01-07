import express, { json, request } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { engine } from 'express-handlebars';
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from 'mongoose';
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { Server } from 'socket.io';
import config from "./config/config.js";
import { __dirname } from './path.js';
import path from 'path';
import logger from "./utils/logger.js";
import initializePassport from "./config/passport.js";
import router from "./routes/api.routes.js";
import routerViews from "./routes/static.routes.js";
import prodModel from "./models/products.models.js";
import userModel from './models/users.models.js';
import ticketModel from './models/ticket.models.js';

const whiteList = [ "http://localhost:8080", "http://localhost:3000", "http://localhost:4000" ];
const corsOptions = {
    origin: function ( origin, callback ){
        if ( whiteList.indexOf ( origin ) != -1 || !origin ){
            callback ( null, true );
        } else {
            callback ( new Error ( "Access denied" ));
        };
    }
};
const PORT = config.port;
const HOST = config.host;
const app = express ();
app.use ( cors ( corsOptions ));
app.use ( express.urlencoded ({ extended: true }));
app.use ( express.json ());
app.use ( cookieParser ( config.JWTSecret ));
app.use ( session ({
    store: MongoStore.create ({
        mongoUrl: config.mongoURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 9000
    }),
    secret: config.privateSession,
    resave: true,
    saveUninitialized: true
})
);
app.use ( passport.initialize ());
app.use ( passport.session ());

mongoose.connect ( config.mongoURL )
.then ( async () => {
    logger.http ( `DB connected` )
})
.catch (( error ) => logger.error ( `Failed to connect to MongoDB Atlas: ${ error }` ));
let prods;
let userCart;
let status = false
app.use (( req, res, next ) => {
    req.isLogged = req.isAuthenticated ();
    status = req.isLogged;
    next ();
});;
const server = app.listen ( PORT, HOST, () => {
    logger.http ( `Server host: ${ HOST } / port: ${ PORT }` );
    logger.http ( `[ SYSTEM INFORMATION: ] [ ${ new Date ().toLocaleString () } ] Server initiated in ${ config.environment } environment mode.` );
});
const io = new Server ( server );
let userMail;
let userTicket;
io.on ( "connection", async ( socket ) => {
    
    const products = JSON.stringify ( await prodModel.find ());
    prods = JSON.parse ( products );
    logger.http ( `Socket.io connection` );
    socket.on ( "newProduct", ( productData ) => {
        prodModel.create ( productData );
        prods = JSON.parse ( products );
    });
    socket.emit ( "reload", true );

    socket.on ( "newUser", async ( userData ) => {
        userMail = userData.email;
        try {
            const data = await user ( userMail );
            if ( userData ) {
                userCart = data.cart;
                socket.emit ( "conf", data );
            }
        } catch ( error ) {
            logger.error ( "Error fetching user data:", error );
        }
        socket.on ( "response", ( response ) => {
            logger.debug ( response );
        });
    });
    socket.emit ( "sessionStatus",  status, userCart );
    socket.emit ( "purchase", userCart );
    const ticket = async ( userEmail ) => {
        const usrTicket = await ticketModel.findOne ({ purchaser: userEmail });
        return usrTicket;
    };
    socket.on ( "orderConf", async () => {
        try {
            const userTicket = await ticket ( userMail );
            socket.emit ( "purchaseResult", userTicket );
        } catch ( error ) {
            logger.error ( "Error getting user ticket:", error );
        }
    });
 
});
io.on ( "error", ( error ) => {
    logger.error ( "Socket.io error:", error );
});
initializePassport ();
app.engine ( "handlebars", engine ());
app.set ( "view engine", "handlebars" );
app.set ( "views", path.resolve ( __dirname, "./views" ));
const user = async ( mail ) => {
    try {
        const userDat = await userModel.findOne ({ email: mail });
        userCart = userDat
        return userDat.rol == "admin"? false :  userDat;
    } catch ( error ) {
        logger.error ( error );
    }
};
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentation of WebAPI - Security eCommerce project",
            description: "Web API for Global Tech Market"
        }
    },
    apis: [ `${ __dirname }/docs/**/*.yaml` ]
};
const specifications = swaggerJSDoc ( swaggerOptions );
app.use ( "/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup ( specifications ) );
app.use ( "/static", express.static ( path.join ( __dirname, "/public" )));
app.use ( "/", router );
app.use ( "/", routerViews )