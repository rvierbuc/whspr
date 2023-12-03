'use strict';
const {
  Model
} = require('sequelize');

interface SoundAttributes {
  userId: number;
  postId: number;
  recordingUrl: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Sound extends Model<SoundAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    userId!: number;
    postId!: number;
    recordingUrl!: string;
    static associate(models) {
      // define association here
      Sound.belongsTo(models.User, { foreignKey: 'userId'})
      Sound.belongsTo(models.Post, { foreignKey: 'postId'})
    }
  }
  Sound.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    recordingUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sound',
  });
  return Sound;
};