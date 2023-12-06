'use strict';
import {Model} from 'sequelize';

interface PostAttributes {
  userId: number;
  category: string;
  title: string;
  url: string;
  audioId: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Post extends Model<PostAttributes>
  implements PostAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    userId!: number;
    category!: string;
    title!: string;
    url!: string;
    audioId!: number;
    static associate(models: any) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId'})
      Post.belongsTo(models.Post, { foreignKey: 'postId'})
      Post.belongsTo(models.Sound, { foreignKey: 'audioId'})
    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    audioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};