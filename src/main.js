import express, { json } from 'express';
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
        ttl: 90
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
const mailMessages = [];
let prods;
const server = app.listen ( PORT, HOST, () => {
    logger.http ( `Server host: ${ HOST } / port: ${ PORT }` );
    logger.http ( `[ SYSTEM INFORMATION: ] [ ${ new Date ().toLocaleString () } ] Server initiated in ${ config.environment } environment mode.` );
});
const io = new Server ( server );
io.on ( "connection", async ( socket ) => {
    const products = JSON.stringify ( await prodModel.find ());
    prods = JSON.parse ( products );
    logger.http ( `Socket.io connection` );
    socket.on ( "newProduct", ( productData ) => {
        prodModel.create ( productData );
        prods = JSON.parse ( products );
    });
    socket.emit ( "reload", true );
    socket.on ( "newUser", ( userData ) => {
        console.log(JSON.stringify(userData));
        if ( userData ) {
            socket.emit ( "conf", userData );
        }
        socket.on ( "response", ( response ) => {
            console.log(response);
        })
    })
    socket.on ( "newCient", ( clientData ) => {
        console.log(clientData);
    })
    socket.on ( "message", mailMessageContent => {
        messageModel.create( mailMessageContent );
        mailMessages.push ( mailMessageContent );
        io.emit ( "showMessages", mailMessages )
    })
});
io.on("error", (error) => {
    console.error("Socket.io error:", error);
});
initializePassport ();
app.engine ( "handlebars", engine ());
app.set ( "view engine", "handlebars" );
app.set ( "views", path.resolve ( __dirname, "./views" ));



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