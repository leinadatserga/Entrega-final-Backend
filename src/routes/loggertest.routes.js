import { Router } from 'express';
import { loggerTest } from '../controllers/loggertest.controller.js';

const routerLogg = Router ();

routerLogg.get ( "/", loggerTest );

export default routerLogg;