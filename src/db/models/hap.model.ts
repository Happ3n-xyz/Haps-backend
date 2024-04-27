import { Model, DataTypes, Sequelize } from 'sequelize';
import { USER_TABLE } from './user.model';

const HAP_TABLE = 'haps';

interface HapAttributes {
  id: string;
  eventName: string;
  eventDate: Date;
  chain: string;
  secretWord: string;
  message: string;
  nftImage?: string;
  ipfsHash?: string;
  userId: string;
  createdAt: Date;
}

const HapSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  eventName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'event_name',
  },
  eventDate: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'event_date',
  },
  chain: {
    allowNull: false,
    type: DataTypes.STRING,
    enum: ['celo', 'rari', 'optimism', 'arbitrum'],
  },
  secretWord: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'secret_word',
  },
  message: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  nftImage: {
    type: DataTypes.STRING,
    field: 'nft_image',
  },
  ipfsHash: {
    type: DataTypes.STRING,
    field: 'ipfs_hash',
  },
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
};

class Hap extends Model<HapAttributes> {

  public id!: string;
  public eventName!: string;
  public eventDate!: Date;
  public chain!: string;
  public secretWord!: string;
  public message!: string;
  public nftImage!: string;
  public ipfsHash!: string;
  public userId!: string;
  public createdAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, {as: 'owner'});
    this.belongsToMany(models.User, {
      as: 'users',
      through: models.Joined,
      foreignKey: 'hapId',
      otherKey: 'userId',
    });

  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: HAP_TABLE,
      modelName: 'Hap',
      timestamps: false,
    };
  }
}

export { HAP_TABLE, HapSchema, Hap, HapAttributes };
