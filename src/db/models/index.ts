import { Sequelize } from 'sequelize';
import { User, UserSchema } from './user.model';
import { Hap, HapSchema } from './hap.model';
import { Joined, JoinedSchema } from './joined.model';

function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Hap.init(HapSchema, Hap.config(sequelize));
  Joined.init(JoinedSchema, Joined.config(sequelize));


  User.associate(sequelize.models);
  Hap.associate(sequelize.models);
  Joined.associate(sequelize.models);
}

export default setupModels;