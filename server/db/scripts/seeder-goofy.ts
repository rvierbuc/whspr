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
        soundURL: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        category: 'The Categorical',
        title: 'The Titular',
        soundURL: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Seed script executed successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();