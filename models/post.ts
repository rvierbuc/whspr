'use strict';
import {Model} from 'sequelize';

interface PostAttributes {
  userId: number;
  category: string;
  //title: string;
  //url: string;
  soundId: number;
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
    //title!: string;
    //url!: string;
    soundId!: number;
    static associate(models: any) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId'})
      //Post.belongsTo(models.Post, { foreignKey: 'postId'})
      Post.hasOne(models.Sound, { foreignKey: 'soundId'})
      Post.belongsTo(models.Sound, { foreignKey: 'postId'})

    }
  }
  Post.init({
    userId: DataTypes.INTEGER,
    category: DataTypes.STRING,
   // title: DataTypes.STRING,
   // url: DataTypes.STRING,
    soundId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
//export {}