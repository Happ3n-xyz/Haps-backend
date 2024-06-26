import boom from "@hapi/boom";
import { HapAttributes } from "../db/models/hap.model";
import sequelize from "../libs/sequelize";
import JoinedService from "./joined.service";
import UserService from "./user.service";
import jwt from 'jsonwebtoken';
import { ethers } from "ethers";
import { config } from "../config/config";
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

    public async getHapsPublicInfo(id: string, token: string) {
        const hap = await sequelize.models.Hap.findByPk(id, {
            attributes: { exclude: ['secretWord', 'userId'] }
        });

        if (!hap) {
            throw boom.notFound('Hap not found');
        }

        if (token) {
            const decoded : any = jwt.decode(token);
            const joined = await this.joinedService.findJoinedByUserIdAndHapId(decoded.id, id);
            if (joined) {
                hap.dataValues.joined = joined
                return hap;
            } else {
                hap.dataValues.joined = null;
                return hap;
            }
        }
        hap.dataValues.joined = null;
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
        const user = await this.userService.findById(userId);
        if (user.dataValues.address === null) {
            throw boom.badRequest('You need to set your wallet address before claiming a Hap');
        }
        const txHash = await this.transferNFT(user.dataValues.address, hap.dataValues.tokenId, "1");
        if (!txHash) {
            throw boom.badRequest('Error claiming NFT');
        }
        
        const claimed = await this.joinedService.updateClaimed(hapId, userId, txHash);
        delete hap.dataValues.secretWord;
        delete hap.dataValues.userId;
        delete hap.dataValues.users;
        hap.dataValues.Joined = claimed;
        return hap;
    }

    private async transferNFT(to: string, tokenId: number, amount: string) {
        try {
            const provider = new ethers.JsonRpcProvider(config.rpcUrl);
            const wallet = new ethers.Wallet(config.pk, provider);
            const contract = new ethers.Contract(config.contractAddress, [
                "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)"
            ], wallet);
            const myData = [1, 2, 3];
            const bytes = new Uint8Array(myData);
            const tx = await contract.safeTransferFrom(wallet.address, to, tokenId, ethers.parseEther(amount), ethers.hexlify(bytes));
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.log('error transfering is ...', error);
            return null;
        }
        
    }
}