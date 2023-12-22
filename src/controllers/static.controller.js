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
            pathCss: "style"
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