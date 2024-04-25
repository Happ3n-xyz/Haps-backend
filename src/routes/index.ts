import { Application, Router } from 'express';
import authRouter from "./auth.router";

export default (app : Application) => {
    const router = Router();
    app.use('/api', router);
    authRouter(router);
}