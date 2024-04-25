import { Sequelize } from 'sequelize';
import { User, UserSchema } from './user.model';
import { Channel, ChannelSchema } from './channel.model';
import { Event, EventSchema } from './event.model';

function setupModels(sequelize: Sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Channel.init(ChannelSchema, Channel.config(sequelize));
  Event.init(EventSchema, Event.config(sequelize));

  User.associate(sequelize.models);
  Channel.associate(sequelize.models);
  Event.associate(sequelize.models);
}

export default setupModels;