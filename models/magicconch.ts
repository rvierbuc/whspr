import { Model } from 'sequelize';

interface MagicConchAttributes {
  sendingUserId: number;
  receivingUserId: number;
  title: string;
  filename: string;
  audioId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class MagicConch extends Model<MagicConchAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    sendingUserId!: number;
    receivingUserId!: number;
    title!: string;
    filename!: string;
    audioId!: number;
    static associate(models: any) {
      // define association here
      MagicConch.belongsTo(models.User, { foreignKey: 'sendingUserId'})
      MagicConch.belongsTo(models.User, { foreignKey: 'receivingUserId'});
      MagicConch.belongsTo(models.Sound, { foreignKey: 'audioId',})
    }
  }
  MagicConch.init({
    sendingUserId: DataTypes.INTEGER,
    receivingUserId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    filename: DataTypes.STRING,
    audioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MagicConch',
  });
  return MagicConch;
};