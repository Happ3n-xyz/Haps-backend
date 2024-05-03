import { Application, Router } from 'express';
import authRouter from "./auth.router";
import hapsRouter from "./haps.router";
import swaggerRouter from "./swagger.router";

export default (app : Application) => {
    const router = Router();
    app.use('/api', router);
    authRouter(router);
    hapsRouter(router);
    swaggerRouter(router);
}