'use strict';
import { Model } from 'sequelize';

interface FollowerAttributes{
  userId: number;
  followingId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Follower extends Model<FollowerAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    userId!: number;
    followingId!: number;
    static associate(models: any) {
      // define association here
      Follower.belongsTo(models.User, { foreignKey: 'userId' });
      Follower.belongsTo(models.User, { foreignKey: 'followingId' });
    }
  }
  Follower.init({
    userId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Follower',
  });
  return Follower;
};