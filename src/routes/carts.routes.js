import { Router } from 'express';
import { getCarts, getCart, postCart, postProdCart, putProdCart, putProdsCart, deleteProdCart, deleteCart, postPurchase } from '../controllers/carts.controller.js';
import { passportError, authorization } from '../utils/errors.js';

const routerCart = Router ();
routerCart.get ( "/", passportError ( "jwt" ), authorization ( "admin" ), getCarts );
routerCart.get ( "/:cid", passportError ( "jwt" ), authorization ([ "premium", "user", "admin" ]), getCart );
routerCart.post ( "/", passportError ( "jwt" ), authorization ( "admin" ), postCart );
routerCart.post ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ([ "premium", "user", "admin" ]), postProdCart );
routerCart.put ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ([ "premium", "user", "admin" ]), putProdCart );
routerCart.put ( "/:cid", passportError ( "jwt" ), authorization ([ "premium", "user" ]), putProdsCart );
routerCart.delete ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ( "admin" ), deleteProdCart );
routerCart.delete ( "/:cid", passportError ( "jwt" ), authorization ( "admin" ), deleteCart );
routerCart.post ( "/:cid/purchase", passportError ( "jwt" ), authorization ([ "premium", "user" ]), postPurchase );

export default routerCart;   