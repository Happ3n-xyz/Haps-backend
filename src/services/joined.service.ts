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
        const claimed = await sequelize.models.User.findByPk(userId,
        {
            attributes: ['id', 'public_name', 'address'],
            include: [{
                model: sequelize.models.Hap,
                as: 'haps',
                attributes: { exclude: ['secretWord', 'userId'] },
                through: {
                    where: {
                        claimed: true
                    }
                }
            }],
            limit: pageSize,
            offset: offset
        });

        if (!claimed) {
            throw boom.notFound('User not found');
        }

        return claimed.dataValues.haps;
    }

    public async findJoinedByUserId(userId: string, page: number, pageSize: number) {
        const offset = (page - 1) * pageSize;
        const joined = await sequelize.models.User.findByPk(userId, {
            attributes: ['id', 'public_name', 'address'],
            include: [{
                model: sequelize.models.Hap,
                as: 'haps',
                attributes: { exclude: ['secretWord', 'userId'] },
            }],
            limit: pageSize,
            offset: offset
        });

        if (!joined) {
            throw boom.notFound('User not found');
        }

        return joined.dataValues.haps;
    }

    public async updateClaimed(hapId: string, userId: string) {
        const joined = await sequelize.models.Joined.findOne({ 
            where: { 
                hapId,
                userId
            }
        });

        if (!joined) {
            throw boom.notFound('Joined not found');
        }

        const updatedJoined = await joined.update({ claimed: true });
        return updatedJoined;
    }

    public async delete(id: string) {
        const joined = await this.findById(id);
        await joined.destroy();
    }
}