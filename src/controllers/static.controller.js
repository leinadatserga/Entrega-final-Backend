import CustomError from "../services/errors/CustomError.js";
import prodModel from "../models/products.models.js";
import logger from "../utils/logger.js";

let products;
async function getProdsData () {
    try {
        products = await prodModel.find ().lean ();
    } catch ( error ) {
        logger.error ( 'Error to get data:', error );
    }
};
export const homeView = async ( req, res ) => {
    try {
        res.render ( "home", {
            pageTitle: "Home",
            nombre: "E - Commerce",
            pathCss: "style",
            pathJs: "home"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const productsView = async ( req, res ) => {
    await getProdsData ();
    try {
        res.render ( "products", {
            pageTitle: "Products",
            nombre: "Nuestros Productos",
            pathCss: "style",
            pathJs: "products",
            prods: products
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const realTimeProdsView = async ( req, res ) => {
    await getProdsData ();
    try {
        res.render ( "realTimeProducts", {
            pageTitle: "RealTimeProducts",
            nombre: "Ingreso de nuevo Producto",
            productsList: products,
            pathCss: "realTimeProducts",
            pathJs: "realTimeProducts"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const loginView = async ( req, res ) => {
    try {
    res.render ( "login", {
        pageTitle: "Login",
        nombre: "Ingreso de Usuario",
        pathCss: "login",
        pathJs: "login"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const messagesView = async ( req, res ) => {
    try {
        res.render ( "messages", {
            pageTitle: "Messages",
            nombre: "Envía tu consulta",
            pathCss: "register",
            pathJs: "messages"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const purchaseView = async ( req, res ) => {
    let user;
    try {

        if ( req.session && req.session.user ) {
            const currentUser = req.session.user;
            user = currentUser;
        }
        res.render ( "purchase", {
            pageTitle: "Purchase",
            nombre: "Confirmación de Compra y Pago",
            user: user,
            pathCss: "style",
            pathJs: "purchase"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};

