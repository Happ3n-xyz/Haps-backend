import { Sequelize } from 'sequelize';
import { User, UserSchema } from './user.model';
import { Hap, HapSchema } from './hap.model';

function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Hap.init(HapSchema, Hap.config(sequelize));


  User.associate(sequelize.models);
  Hap.associate(sequelize.models);
}

export default setupModels;