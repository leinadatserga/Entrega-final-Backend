import { Router } from 'express';
import { homeView, loginView, messagesView, productsView, purchaseView, realTimeProdsView } from '../controllers/static.controller.js';
import { authorization, passportError } from '../utils/errors.js';

const routerViews = Router ();

routerViews.get ( "/static", homeView );
routerViews.get ( "/static/products", productsView );
routerViews.get ( "/static/realtimeproducts", passportError ( "jwt" ), authorization ( "admin" ), realTimeProdsView );
routerViews.get ( "/static/login", loginView );
routerViews.get ( "/static/messages", passportError ( "jwt" ), authorization ([ "user", "premium" ]), messagesView );
routerViews.get ( "/static/purchase", passportError ( "jwt" ), authorization ([ "user", "premium" ]), purchaseView );

export default routerViews;