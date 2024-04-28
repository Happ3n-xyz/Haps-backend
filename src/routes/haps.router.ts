import { Router, Request, Response, NextFunction } from 'express';
import HapService from '../services/hap.service';
import JoinedService from '../services/joined.service';
import validatorHandler from '../middlewares/validator.handler';
import passport from 'passport';
import { basicPaginationHaps, claimHap, createHap, getHap, updateHap } from '../schemas/haps.schema';
import { HapAttributes } from '../db/models/hap.model';

const router = Router();
const hapService = new HapService();
const joinedService = new JoinedService();

export default (app: Router) => {
    app.use('/haps', router);

    router.get('/created/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getHap, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id : userId } = req.user as { id: string };
            const { id } = req.params;
            const result = await hapService.getHapsDetailsByOnwer(id, userId);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.get('/created',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await hapService.listByUserId(id, parseInt(page), parseInt(pageSize));
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.get('/claimed',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await joinedService.findClaimedByUserId(id, parseInt(page), parseInt(pageSize));
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.get('/joined',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await joinedService.findJoinedByUserId(id, parseInt(page), parseInt(pageSize));
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.get('/:id',
    validatorHandler(getHap, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const result = await hapService.getHapsPublicInfo(id);
            return res.json(result).status(200);
        } catch (e) {
        next(e);
        }
    });

    router.get('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await hapService.list(parseInt(page), parseInt(pageSize));
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.post('/claim',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(claimHap, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { secretWord, id: hapId } = req.body as { secretWord: string, id: string };
            const result = await hapService.claimHap(hapId, id, secretWord);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.post('/join/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getHap, 'params'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const result = await joinedService.create({ hapId: id, userId });
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    router.post('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(createHap, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hap = req.body as Partial<Omit<HapAttributes, 'id' | 'createdAt' | 'userId'>>;
            const { id } = req.user as { id: string };
            const result = await hapService.create({ ...hap, userId: id });
            res.json(result).status(200);
        } catch (error) {
        next(error);
        }
    });

    router.patch('/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getHap, 'params'),
    validatorHandler(updateHap, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const hap = req.body as Partial<Omit<HapAttributes, 'id' | 'createdAt' | 'userId'>>;
            const result = await hapService.update(id, userId, hap);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });
}