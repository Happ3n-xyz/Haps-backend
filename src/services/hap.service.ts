import boom from "@hapi/boom";
import { HapAttributes } from "../db/models/hap.model";
import sequelize from "../libs/sequelize";

export default class HapService {
    constructor() {}

    public async create(hap: Partial<Omit<HapAttributes, 'id' | 'createdAt'>>) {
        const newHap = await sequelize.models.Hap.create(hap);
        return newHap;
    }

    public async findById(id: string) {
        const hap = await sequelize.models.Hap.findByPk(id, {
            include: [{
                model: sequelize.models.Joined,
                as: 'joined',
                include: [{
                    model: sequelize.models.User,
                    as: 'user',
                    attributes: ['id', 'public_name', 'address'],
                }],
            }]
        });
        if (!hap) {
            throw boom.notFound('Hap not found');
        }
        return hap;
    }

    public async update(id: string, changes: Partial<Omit<HapAttributes, 'id' | 'createdAt'>>) {
        const hap = await this.findById(id);
        const updatedHap = await hap.update(changes);
        return updatedHap;
    }

    public async delete(id: string) {
        const hap = await this.findById(id);
        await hap.destroy();
    }

    public async list() {
        const haps = await sequelize.models.Hap.findAll();
        return haps;
    }

    public async listByUserId(userId: string) {
        const haps = await sequelize.models.Hap.findAll({ where: { userId } });
        return haps;
    }
}