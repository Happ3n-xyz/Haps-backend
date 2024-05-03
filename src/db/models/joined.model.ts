
import { Model, DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from './user.model';
import { HAP_TABLE } from './hap.model';

const JOINED_TABLE = 'joined';

interface JoinedAttributes {
    id: string;
    claimed: boolean;
    userId: string;
    hapId: string;
    createdAt: Date;
}

const JoinedSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    claimed: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'user_id',
        references: {
            model: USER_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    hapId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'hap_id',
        references: {
            model: HAP_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
};

class Joined extends Model<JoinedAttributes> {

    public id!: string;
    public claimed!: boolean;
    public userId!: string;
    public hapId!: string;
    public createdAt!: Date;

    static associate(models: any) {

    }

    static config(sequelize: Sequelize) {
    return {
        sequelize,
        tableName: JOINED_TABLE,
        modelName: 'Joined',
        timestamps: false,
    };
    }
}

export { JOINED_TABLE, JoinedSchema, Joined, JoinedAttributes };
