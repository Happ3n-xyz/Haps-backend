import boom from '@hapi/boom';
import { JoinedAttributes } from '../db/models/joined.model';
import sequelize from '../libs/sequelize';

export default class JoinedService {
    constructor() {}

    public async create(joined : Partial<Omit<JoinedAttributes, 'id' | 'createdAt'>>) {
        const newJoined = await sequelize.models.Joined.create(joined);
        return newJoined;
    }

    public async findById(id: string) {
        const joined = await sequelize.models.Joined.findByPk(id);
        if (!joined)
        {
            throw boom.notFound('Joined not found');
        }
        return joined;
    }

    public async findClaimedByUserId(userId: string, page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const joined = await sequelize.models.Joined.findAndCountAll({ 
            include: [{
                model: sequelize.models.Hap,
                as: 'haps',
            }],
            where: { 
                userId,
                claimed: true 
            },
            limit: pageSize,
            offset: offset
        });
        return joined;
    }

    public async findJoinedByUserId(userId: string, page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const joined = await sequelize.models.Joined.findAndCountAll({ 
            include: [{
                model: sequelize.models.Hap,
                as: 'haps',
            }],
            where: { 
                userId,
            },
            limit: pageSize,
            offset: offset
        });
        return joined;
    }

    public async delete(id: string) {
        const joined = await this.findById(id);
        await joined.destroy();
    }
}