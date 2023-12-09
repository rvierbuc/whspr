'use strict';
import {Model} from 'sequelize';

interface SoundAttributes {
  //userId: number;
  postId: number;
  recordingUrl: string;
  title: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Sound extends Model<SoundAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //userId!: number;
    postId!: number;
    title!: string;
    recordingUrl!: string;
    static associate(models: any) {
      // define association here
      //Sound.belongsTo(models.User, { foreignKey: 'userId'})
      Sound.belongsTo(models.Post, { foreignKey: 'soundId'})
      Sound.hasOne(models.Post, {foreignKey: 'postId'})
    }
  }
  Sound.init({
    //userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    recordingUrl: DataTypes.STRING,
    title: DataTypes.STING
  }, {
    sequelize,
    modelName: 'Sound',
  });
  return Sound;
};
//export {}