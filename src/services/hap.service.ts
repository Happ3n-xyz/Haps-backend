import boom from "@hapi/boom";
import { HapAttributes } from "../db/models/hap.model";
import sequelize from "../libs/sequelize";
import JoinedService from "./joined.service";
import UserService from "./user.service";

export default class HapService {
    
    private joinedService: JoinedService;
    private userService: UserService
    
    constructor() {
        this.joinedService = new JoinedService();
        this.userService = new UserService();
    }

    public async create(hap: Partial<Omit<HapAttributes, 'id' | 'createdAt'>>) {
        const newHap = await sequelize.models.Hap.create(hap);
        return newHap;
    }

    async findById(id: string) {
        const hap = await sequelize.models.Hap.findByPk(id, {
            include: [{
                model: sequelize.models.User,
                as: 'users',
                attributes: ['id', 'public_name', 'address']
            }]
        });
        if (!hap) {
            throw boom.notFound('Hap not found');
        }
        return hap;
    }

    public async update(id: string, userId: string, changes: Partial<Omit<HapAttributes, 'id' | 'createdAt'>>) {
        const hap = await this.findById(id);
        if (hap.dataValues.userId !== userId) {
            throw boom.unauthorized('You are not the owner of this Hap');
        }
        const updatedHap = await hap.update(changes);
        return updatedHap;
    }

    public async delete(id: string) {
        const hap = await this.findById(id);
        await hap.destroy();
    }

    public async list(page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const haps = await sequelize.models.Hap.findAndCountAll({
            attributes: { exclude: ['secretWord', 'userId'] },
            limit: pageSize,
            offset: offset
        });
        return haps;
    }

    public async listByUserId(userId: string, page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const haps = await sequelize.models.Hap.findAndCountAll({
            where: { userId },
            limit: pageSize,
            offset: offset
        });
        return haps;
    }

    public async getHapsDetailsByOnwer(id: string, userId: string) {
        const hap = await this.findById(id);
        if (hap.dataValues.userId !== userId) {
            throw boom.unauthorized('You are not the owner of this Hap');
        }
        return hap;
    }

    public async getHapsPublicInfo(id: string) {
        const hap = await sequelize.models.Hap.findByPk(id, {
            attributes: { exclude: ['secretWord', 'userId'] }
        });

        if (!hap) {
            throw boom.notFound('Hap not found');
        }


        return hap;
    }

    public async joinHap(hapId: string, userId: string) {
        const hap = await this.findById(hapId);
        await this.userService.findById(userId);
        await this.joinedService.create({ hapId, userId });
        delete hap.dataValues.secretWord;
        delete hap.dataValues.userId;
        return hap;
    }

    public async claimHap(hapId: string, userId: string, secretWord: string) {
        const hap = await this.findById(hapId);
        if (hap.dataValues.secretWord !== secretWord) {
            throw boom.unauthorized('Secret word is not correct');
        }

        //Pending: claim blockchain
        const txHash = '0xabcd1234';
        
        const claimed = await this.joinedService.updateClaimed(hapId, userId, txHash);
        delete hap.dataValues.secretWord;
        delete hap.dataValues.userId;
        delete hap.dataValues.users;
        hap.dataValues.Joined = claimed;
        return hap;
    }
}