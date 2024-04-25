import sequelize from "../libs/sequelize"

export const generateRandomUsername = async () => { 
    const totalUsers = await sequelize.models.User.count();
    return `user_${totalUsers + 1}`;
};