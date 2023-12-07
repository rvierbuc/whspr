'use strict';
const {
  Model
} = require('sequelize');

interface UsersRadioAttributes{
  socketId: number;
  userId: number;
  radiosId: number;
}

module.exports = (sequelize: any, DataTypes:any) => {
  class UsersRadio extends Model<UsersRadioAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    socketId!: number;
    userId!: number;
    radiosId!:number;
    static associate(models: any) {
      // define association here
      UsersRadio.belongsTo(User, { foreignKey: 'userId'});
      UsersRadio.belongsTo(Radio, { foreignKey: 'radiosId'});
    }
  }
  UsersRadio.init({
    socketId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    radiosId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UsersRadio',
  });
  return UsersRadio;
};