'use strict';
const {
  Model
} = require('sequelize');

interface UserAttributes {
  id: number,
  username: string
}


module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> 
  implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    username!: string;
    static associate(models: any) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};