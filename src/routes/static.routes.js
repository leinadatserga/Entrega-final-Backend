import { Router } from 'express';
import { homeView, productsView, realTimeProdsView } from '../controllers/static.controller.js';

const routerViews = Router ();

routerViews.get ( "/static", homeView );
routerViews.get ( "/static/products", productsView );
routerViews.get ( "/static/realtimeproducts", realTimeProdsView );

export default routerViews;