import { Model, DataTypes, Sequelize } from 'sequelize';

const USER_TABLE = 'users';

interface UserAttributes {
  id: string;
  username: string;
  publicName?: string;
  isActive: boolean;
  address?: string;
  nonce?: string;
  role: string;
  createdAt: Date;
}

const UserSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  publicName: {
    type: DataTypes.STRING,
    field: 'public_name',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  nonce: {
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
};

class User extends Model<UserAttributes> {

  public id!: string;
  public username!: string;
  public publicName!: string;
  public isActive!: boolean;
  public address!: string;
  public nonce!: string;
  public role!: string;
  public createdAt!: Date;

  static associate(models: any) {
    this.hasMany(models.Hap, {
      as: 'myHaps',
      foreignKey: 'userId',
    });
    this.belongsToMany(models.Hap, {
      as: 'haps',
      through: models.Joined,
      foreignKey: 'userId',
      otherKey: 'hapId',
    });
  }

  static config(sequelize: Sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
    };
  }
}

export { USER_TABLE, UserSchema, User, UserAttributes };
