import prodModel from "../models/products.models.js";
import { randomProducts } from "../utils/mockprods.js";
import CustomError from "../services/errors/CustomError.js";
import { productValidation } from "../middlewares/joiValidation.js";

export const getProducts = async ( req, res ) => {
    const { limit, page, query, sort } = req.query;
    const pg = page ? page : 1;
    const lmt = limit ? limit : 10;
    const srt = sort == "asc" ? 1 : -1;
    let queryParsed;
    query ? queryParsed = JSON.parse(query) : queryParsed = {};
    try {
        const productsSort = await prodModel.paginate ( queryParsed , { limit: lmt, page: pg, sort: {"price": srt } });
        const products = await prodModel.paginate ( queryParsed , { limit: lmt, page: page });
        if ( sort ) {
            return res.status ( 200 ).send ( productsSort );  
        } else {
            return res.status ( 200 ).send ( products );
        }
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const getProduct = async ( req, res ) => {
    const { id } = req.params;
    try {
        const product = await prodModel.findById ( id );
        if ( product ) {
            return res.status ( 200 ).send ( product );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` )
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );  
    }
};
export const postProduct = async ( req, res ) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const validProd = productValidation ( req.body );
    const existProd = await prodModel.findOne ({ code: code });
    
    try {
        if ( validProd.error || existProd ) {
        throw Error
        }
        const newProduct = await prodModel.create ({ title, description, code, price, status, stock, category, thumbnails });
        if ( newProduct ) {
            return res.status ( 201 ).send ({ message: "New Product created", newProduct });
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
        if ( error.code == 11000 ) {
            return res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        } else {
            return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
        }
    } 
};
export const putProduct = async ( req, res ) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const productToUpdate = await prodModel.findByIdAndUpdate ( id, { title, description, code, price, status, stock, category, thumbnails });
        const updatedProduct = await prodModel.findById ( id )
        if ( productToUpdate ) {
            return res.status ( 200 ).send ({ message: "Product updated successfully", updatedProduct });
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` ); 
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const deleteProduct = async ( req, res ) => {
    const { id } = req.params;
    try {
        const deletedProduct = await prodModel.findByIdAndDelete ( id );
        if ( deletedProduct ) {
            return res.status ( 200 ).send ({ message: "Product deleted successfully", deletedProduct });
         }
         return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const getMockingProducts = async ( req, res ) => {
    try {
        const mockingsProducts = randomProducts(100);
        if ( mockingsProducts ) {
            return res.status ( 200 ).send ( mockingsProducts );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` ); 
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );  
    }
}; 