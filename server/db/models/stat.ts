'use strict';
const {
  Model
} = require('sequelize');

interface StatAttributes{
  userId: number;
  postId: number;
  type: string;
}

module.exports = (sequelize, DataTypes) => {
  class Stat extends Model<StatAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    userId!: number;
    postId!: number;
    type!: string;
    static associate(models) {
      // define association here
      Stat.belongsTo(models.User, { foreignKey: 'userId' });
      Stat.belongsTo(models.Post, { foreignKey: 'postId' });
    }
  }
  Stat.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stat',
  });
  return Stat;
};