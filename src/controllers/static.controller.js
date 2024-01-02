import CustomError from "../services/errors/CustomError.js";
import prodModel from "../models/products.models.js";


let items;
async function getData() {
    try {
        const datos = await prodModel.find ().lean ();;
        items = datos
    } catch (error) {
        console.error('Error to get data:', error);
    }
}


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
    await getData();
    try {
        res.render ( "products", {
            pageTitle: "Products",
            nombre: "Products List",
            pathCss: "style",
            pathJs: "home",
            prods: items
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const realTimeProdsView = async ( req, res ) => {
    await getData();
    try {
        res.render ( "realTimeProducts", {
            pageTitle: "RealTimeProducts",
            nombre: "Ingreso de nuevo Producto",
            productsList: items,
            pathCss: "realTimeProducts",
            pathJs: "realTimeProducts"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const loginView = async ( req, res ) => {
    const user = [{first_name: "Pocho", last_name: "LaPantera", email: "pochomiau@mail.com", age: 59 }];
    try {
    res.render ( "login", {
        pageTitle: "Login",
        nombre: "Ingreso de Usuario",
        userDats: user,
        pathCss: "login",
        pathJs: "login"
        });
    } catch ( error ) {
        return res.status ( 500 ).send ( `${ error }` );
    }
};
export const registerView = async ( req, res ) => {
    const user = [{first_name: "Pocho", last_name: "LaPantera", email: "pochomiau@mail.com", age: 59 }];
    try {
        res.render ( "register", {
            pageTitle: "Register",
            nombre: "Registro de Cliente",
            clientDats: user,
            pathCss: "register",
            pathJs: "register"
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