import { Router } from 'express';
import { passportError, authorization } from '../utils/errors.js';
import { getProducts, getProduct, postProduct, putProduct, deleteProduct, getMockingProducts } from '../controllers/products.controller.js';

const routerProd = Router ();
routerProd.get ( "/mockingproducts", passportError ( "jwt" ), authorization ( "admin" ), getMockingProducts);
routerProd.get ( "/", getProducts );
routerProd.get ( "/:id", passportError ( "jwt" ), authorization ([ "admin", "premium", "user" ]), getProduct );
routerProd.post ( "/", passportError ( "jwt" ), authorization ( "admin" ), postProduct );
routerProd.put ( "/:id", passportError ( "jwt" ), authorization ( "admin" ), putProduct );
routerProd.delete ( "/:id", passportError ( "jwt" ), authorization ( "admin" ), deleteProduct );


export default routerProd;