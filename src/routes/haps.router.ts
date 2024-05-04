import { Router, Request, Response, NextFunction } from 'express';
import HapService from '../services/hap.service';
import JoinedService from '../services/joined.service';
import validatorHandler from '../middlewares/validator.handler';
import passport from 'passport';
import { basicPaginationHaps, claimHap, createHap, getHap, getHapDetails, updateHap } from '../schemas/haps.schema';
import { HapAttributes } from '../db/models/hap.model';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/constants';

const router = Router();
const hapService = new HapService();
const joinedService = new JoinedService();

/**
 * @swagger
 * tags:
 *   name: Haps
 *   description: Haps operations
 */ 
export default (app: Router) => {
    app.use('/haps', router);

    /**
     * @swagger
     * /haps/created/{id}:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get an specific hap created by user
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *         type: string
     *         description: Hap Id
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     *       404:
     *         description: Hap not found
     */
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

    /**
     * @swagger
     * /haps/created:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get all the haps created by user
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: string
     *         description: Page number
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: string
     *         description: Page size
     *     responses:
     *       200:
     *         description: Returns the json with the haps details
     *       401:
     *         description: User not authorized
     */
    router.get('/created',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await hapService.listByUserId(id, parseInt(page) || DEFAULT_PAGE, parseInt(pageSize) || DEFAULT_PAGE_SIZE);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /haps/claimed:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get all the haps claimed by user
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: string
     *         description: Page number
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: string
     *         description: Page size
     *     responses:
     *       200:
     *         description: Returns the json with the haps claimed
     *       401:
     *         description: User not authorized
     *       404:
     *         description: User not found
     */
    router.get('/claimed',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await joinedService.findClaimedByUserId(id, parseInt(page) || DEFAULT_PAGE, parseInt(pageSize) || DEFAULT_PAGE_SIZE);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /haps/joined:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get all the haps joined by user
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: string
     *         description: Page number
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: string
     *         description: Page size
     *     responses:
     *       200:
     *         description: Returns the json with the haps joined
     *       401:
     *         description: User not authorized
     *       404:
     *         description: User not found
     */
    router.get('/joined',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await joinedService.findJoinedByUserId(id, parseInt(page) || DEFAULT_PAGE, parseInt(pageSize) || DEFAULT_PAGE_SIZE);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /haps/{id}:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get the public info for a hap
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *         type: string
     *         description: Hap Id
     *       - in: query
     *         name: token
     *         schema:
     *         type: string
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     *       404:
     *         description: Hap not found
     */
    router.get('/:id',
    validatorHandler(getHap, 'params'),
    validatorHandler(getHapDetails, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const { token } = req.query as { token: string };
            const result = await hapService.getHapsPublicInfo(id, token);
            return res.json(result).status(200);
        } catch (e) {
        next(e);
        }
    });

    /**
     * @swagger
     * /haps:
     *   get:
     *     tags:
     *       - Haps
     *     summary: Get all the haps
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: string
     *         description: Page number
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: string
     *         description: Page size
     *     responses:
     *       200:
     *         description: Returns the json with the haps details
     *       401:
     *         description: User not authorized
     */
    router.get('/',
    validatorHandler(basicPaginationHaps, 'query'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, pageSize } = req.query as { page: string, pageSize: string };
            const result = await hapService.list(parseInt(page) || DEFAULT_PAGE, parseInt(pageSize) || DEFAULT_PAGE_SIZE);
            return res.json(result).status(200);
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /haps/claim:
     *   post:
     *     tags:
     *       - Haps
     *     summary: Claim a hap
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *               secretWord:
     *                 type: string
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     *       404:
     *         description: Hap not found
     */
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

    /**
     * @swagger
     * /haps/join/{id}:
     *   post:
     *     tags:
     *       - Haps
     *     summary: Join a hap
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *         type: string
     *         description: Hap Id
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     *       404:
     *         description: Hap not found
     */
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

    /**
     * @swagger
     * /haps:
     *   post:
     *     tags:
     *       - Haps
     *     summary: Create a new hap
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenId:
     *                 type: string
     *               nftImage:
     *                 type: string
     *               ipfsHash:
     *                 type: string
     *               eventName:
     *                 type: string
     *               eventDate:
     *                 type: string
     *               chain:
     *                 type: string
     *                 enum: ['celo', 'rari', 'optimism', 'arbitrum']
     *               secretWord:
     *                 type: string
     *               message:
     *                 type: string
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     */
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

    /**
     * @swagger
     * /haps/{id}:
     *   patch:
     *     tags:
     *       - Haps
     *     summary: Delete a hap
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *         type: string
     *         description: Hap Id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventName:
     *                 type: string
     *               eventDate:
     *                 type: string
     *               chain:
     *                 type: string
     *               secretWord:
     *                 type: string
     *               message:
     *                 type: string
     *     responses:
     *       200:
     *         description: Returns the json with the hap details
     *       401:
     *         description: User not authorized
     *       404:
     *         description: Hap not found
     */
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