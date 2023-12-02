'use strict';
const {
  Model
} = require('sequelize');

interface PostAttributes {
  id: number,
  userId: number,
  category: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Post extends Model<PostAttributes>
  implements PostAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    userId!: number;
    category!: string;
    static associate(models: any) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId'})
    }
  }
  Post.init({
    userId: DataTypes.NUMBER,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};