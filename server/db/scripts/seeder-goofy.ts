import { Sound, User, Post } from '../../dbmodels';

export const seedDatabase = async () => {
  try {
    
    await Sound.bulkCreate([
      {
        postId: 1,
        soundURL: `https://website.com/recording-205.wav`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 1,
        soundURL: `https://website.com/recording-205.wav`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    
    await User.create({
      breakme: {},
      username: 'RandomUser',
      profileImgUrl: 'https://website.com/profile-image.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    
    await Post.bulkCreate([
      {
        userId: 1,
        category: 'The Categorical',
        title: 'The Titular',
        soundURL: 'leftloosey.com/yep.mp3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        category: 'The Categorical',
        title: 'The Titular',
        soundURL: 'thanks.com/potato.wav',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.info('\x1b[32m%s\x1b[0m', 'Seed script executed successfully');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Seed script failed', error);
  }
};

seedDatabase();