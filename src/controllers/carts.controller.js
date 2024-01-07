import cartModel from '../models/carts.models.js';
import ticketModel from '../models/ticket.models.js';
import prodModel from '../models/products.models.js';
import { uCode } from '../utils/uuid.js';
import { datetime } from '../utils/datetime.js';
import logger from '../utils/logger.js';
import CustomError from '../services/errors/CustomError.js';



export const getCarts = async ( req, res ) => {
    try {
        const carts = await cartModel.find ();
        return res.status ( 200 ).send ( carts );  
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const getCart = async ( req, res ) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById ( cid );
        if ( cart ) {
            const cartProdRef = await cartModel.findOne ({ _id: cid }).populate ( "products.id_prod" );
            return res.status ( 200 ).send ( cartProdRef );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const postCart = async ( req, res ) => {
    try {
        const newCart = await cartModel.create ({});
        return res.status ( 201 ).send ( newCart ); 
    } catch (error) {
      return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );  
    }
};
export const postProdCart = async ( req, res ) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        let quant;
        const cartFind = await cartModel.findById ( cid );
        if ( !cartFind ) res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
        const indexProd = cartFind.products.findIndex ( prod => prod.id_prod == pid );
        if ( indexProd != -1 ) {
            quant = cartFind.products [ indexProd ].quantity + quantity;
            cartFind.products.splice ( indexProd, 1, { id_prod: pid, quantity: quant });
            await cartModel.findByIdAndUpdate ( cid, cartFind );
        } else {
                cartFind.products.push ({ id_prod: pid, quantity: quantity });
                await cartModel.findByIdAndUpdate ( cid, cartFind );
            }
        return res.status ( 200 ).send ( cartFind );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const putProdCart = async ( req, res ) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        let quant;
        const cart = await cartModel.findById ( cid );
        const indexProd = cart.products.findIndex ( prod => prod.id_prod == pid );
        if ( indexProd != -1 ) {
            quant = cart.products [ indexProd ].quantity + quantity;
            cart.products.splice ( indexProd, 1, { id_prod: pid, quantity: quant });
            await cartModel.findByIdAndUpdate ( cid, cart );
            return res.status ( 200 ).send ( cart );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const putProdsCart = async ( req, res ) => {
    const { cid } = req.params;
    const prods = req.body;
    try {
        const cartFind = await cartModel.findById ( cid );
        const newCart = async ( cid, cartFind ) => await cartModel.findByIdAndUpdate ( cid, cartFind );
        let prodId;
        prods.forEach ( element => {
            prodId = cartFind.products.find ( prod => prod.id_prod == element.id_prod );
            if ( prodId == undefined ) {
                cartFind.products.push ( element );
            } else {
                let quant = ( prodId.quantity + element.quantity );
                prodId.quantity = quant;
            }
        });
        newCart ( cid, cartFind );
        return res.status ( 200 ).send ( cartFind );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const deleteProdCart = async ( req, res ) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById ( cid );
        const indexProd = cart.products.findIndex ( prod => prod.id_prod == pid );
        if ( indexProd != -1 ) {
            cart.products.splice ( indexProd, 1 );
            await cartModel.findByIdAndUpdate ( cid, cart );
            return res.status ( 200 ).send ( cart );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};
export const deleteCart = async ( req, res ) => {
    const { cid } = req.params;
    try {
        const deletedCart = await cartModel.findById ( cid );
        if ( deletedCart ) {
            deletedCart.products.splice ( 0 );
            await cartModel.findByIdAndUpdate ( cid, deletedCart );
            return res.status ( 200 ).send ( deletedCart );
        }
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` );
    } catch (error) {
       return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const postPurchase = async ( req, res ) => {
    const { cid } = req.params;
    let totalPrice = 0;
    try {
        const cart = await cartModel.findById ( cid );
        const userDat = req.user.user
        if ( cart && req.user ) {
            const cartProdRef = await cartModel.findOne ({ _id: cid }).populate ( "products.id_prod" );
            cartProdRef.products.forEach ( prod => {
                const prodProperties = prod.id_prod;
                const prodStock = prodProperties.stock;
                if (prod.quantity <= prodStock){
                    const updatedStock = prodStock-prod.quantity
                    const parcialPrice = (prodProperties.price)*prod.quantity
                    totalPrice = totalPrice + parcialPrice;
                    (async()=> await prodModel.findByIdAndUpdate ( prod.id_prod, { stock: updatedStock }))();
                } else {
                    logger.debug("Out of stock");
                }
            })
            if ( userDat.rol == "premium" ) {
                totalPrice = totalPrice * 0.9;
            };
            const newTicket = await ticketModel.create({ code: uCode (), purchase_datetime: datetime, amount: totalPrice, purchaser: userDat.email });
            cart.products.splice ( 0 );
            await cartModel.findByIdAndUpdate ( cid, cart );
            return res.status ( 200 ).send ( newTicket );
        }
        logger.error ( `[ ERROR / CARTS / PURCHASE ] [ ${ datetime } ] Ha ocurrido un error: "Not found or invalid user"` )
        return res.status ( 404 ).send ( `${ CustomError.NotFound ()}` ); 
    } catch (error) {
        return res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};