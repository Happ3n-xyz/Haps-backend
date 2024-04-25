import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import validatorHandler from '../middlewares/validator.handler';
import { requestNonce, signIn } from '../schemas/auth.schema';
import passport from 'passport';

const router = Router();
const authService = new AuthService();

export default (app: Router) => {
  app.use('/auth', router);

  router.get('/auto-login-user',
    passport.authenticate('jwt', {session: false}),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.user as { id: string };
        const result = await authService.autoSignIn(id);
        return res.json(result).status(200);
      } catch (e) {
        next(e);
      }
    },
  );

  router.post(
    '/request-nonce',
    validatorHandler(requestNonce, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { address } = req.body;
        const result = await authService.generateNonce(address);
        res.json(result).status(200);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post('/login-user',
    validatorHandler(signIn, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { address, nonce, signature} = req.body as { address: string, nonce: string, signature: string };
        const result = await authService.signedSignIn(address, nonce, signature);
        return res.json(result).status(200);
      } catch (error) {
        next(error);
      }
    },
  );
}