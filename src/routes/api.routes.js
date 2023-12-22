import { Router } from "express";
import routerCart from "./carts.routes.js";
import routerProd from "./products.routes.js";
import routerMessages from "./messages.routes.js";
import routerSession from "./sessions.routes.js";
import routerUsers from "./users.routes.js";
import routerLogg from "./loggertest.routes.js";

const router = Router ();

router.use ( "/api/carts", routerCart );
router.use ( "/api/products", routerProd );
router.use ( "/api/messages", routerMessages );
router.use ( "/api/session", routerSession );
router.use ( "/api/users", routerUsers );
router.use ( "/loggerTest", routerLogg ); 

export default router;