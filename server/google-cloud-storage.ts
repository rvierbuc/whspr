import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid';
import { Post, Sound, Comment, MagicConch, SharedPost } from './dbmodels'
const storage = new Storage({
  keyFilename: './key.json',
  projectId: 'whspr-406622'
})


const bucket = storage.bucket('whspr-sounds')

const saveAudio = async (audio: any, userId, title: string, categories: string[]): Promise<void | string> => {
  const file = bucket.file(`audio/${Date.now()}.wav`)
  const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`
  try {

    const postRecord = await Post.create({
      title,
      categories,
      userId,
      soundUrl: downloadURL,
      likeCount: 0,
      commentCount: 0,
      listenCount: 0
    })
    const postId = postRecord.get('id')
    if (!postId) {
      console.error('postId not found in saveAudio')
    }
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/wav'
      }
    })
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        writeStream.on('error', (error) => {
          console.error('Error uploading audio:', error);
          reject(error);
        });
        writeStream.on('finish', () => {
          resolve();
        });
        writeStream.end(audio);
      }),
      Sound.create({
        userId,
        postId,
        soundUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
    ])
    console.log('Audio saved to cloud')
  } catch (error) {
    console.error('Error handling audio upload:', error)
  }
}

const saveAudioComment = async (audio: any, userId, postId): Promise<void | string> => {
  const file = bucket.file(`audio/${Date.now()}.wav`)
  const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`
  try {
    const commentRecord = await Comment.create({
      userId,
      postId,
      soundUrl: downloadURL
    })
    const commentId = await commentRecord.get('id')
    if (!commentId) {
      console.error('commentId not found in saveAudioComment')
    }
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/wav'
      }
    })
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        writeStream.on('error', (error) => {
          console.error('Error uploading audio:', error);
          reject(error);
        });
        writeStream.on('finish', () => {
          resolve();
        });
        writeStream.end(audio);
      }),
      Sound.create({
        userId,
        postId,
        soundUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
    ])
    console.log('Audio saved to cloud')
    return downloadURL
  } catch (error) {
    console.error('Error handling audio upload:', error)
  }
}
const saveSharePost = async (audio: any, sentFromId, sentToId, postId): Promise<void | string> => {
  const file = bucket.file(`audio/${Date.now()}.wav`)
  const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`
  try {
    const sharePostRecord = await SharedPost.create({
      sentFromId,
      sentToId,
      postId,
      captionUrl: downloadURL,
      hasSeen: false,
    })
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/wav'
      }
    })
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        writeStream.on('error', (error) => {
          console.error('Error uploading audio:', error);
          reject(error);
        });
        writeStream.on('finish', () => {
          resolve();
        });
        writeStream.end(audio);
      }),
      Sound.create({
        userId: sentFromId,
        soundUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
    ])
    console.log('Audio saved to cloud')
    return downloadURL
  } catch (error) {
    console.error('Error handling audio upload:', error)
  }
}

const deleteAudioPost = async (userId: any, id: any) => {
  userId = Number(userId);
  // const id = postId;
  try {
    await Promise.all([
      Post.destroy({ where: { userId: userId, id: id } }),
      Sound.destroy({ where: { postId: id } })
    ])
  } catch (error) {
    console.error('Error deleting Post', error);
  }
};

const saveAudioConch = async (audio: any, sendingUserId, receivingUserId, title: string): Promise<void | string> => {
  const file = bucket.file(`audio/${Date.now()}.wav`)
  const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`

  try {

    const writeStream = file.createWriteStream({
      metadata: {
        contentType: 'audio/wav'
      }
    })
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        writeStream.on('error', (error) => {
          console.error('Error uploading audio:', error);
          reject(error);
        });
        writeStream.on('finish', () => {
          resolve();
        });
        writeStream.end(audio);
      }),
      Sound.create({
        userId: sendingUserId,
        soundUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
      MagicConch.create({
        receivingUserId,
        sendingUserId,
        title,
        soundUrl: downloadURL,
        hasSeen: false,
      })
    ])
    //const commentId = await conchRecord.get('id')
    // if(!commentId){
    //   console.error('commentId not found in saveAudioComment')
    // }
  } catch (error) {
    console.error('Error handling audio upload:', error)
  }
}

const getAudioUrl = async (postId: number): Promise<string | null> => {
  try {
    const soundRecord = await Sound.findOne({ where: { postId } });

    if (!soundRecord) {
      console.error('Sound record not found.');
      return null;
    }
    const soundUrl = soundRecord.get('soundUrl') as string;
    if (!soundUrl) {
      console.error('Audio URL not found.')
    }
    return soundUrl;
  } catch (error) {
    console.error('Error retrieving audio URL:', error);
    return null;
  }
};

const saveImage = async (imageBuffer: Buffer, imageType: string, userId: string) => {
  const uniqueFilename = `${userId}-${uuidv4()}`;
  const file = bucket.file(`images/${uniqueFilename}`);
  const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

  try {
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: imageType,
      },
    });

    await new Promise<void>((resolve, reject) => {
      writeStream.on('error', (error) => {
        console.error('Error uploading image:', error);
        reject(error);
      });
      writeStream.on('finish', () => {
        resolve();
      });
      writeStream.end(imageBuffer);
    });

    console.log('Image saved to cloud');
    return downloadURL;
  } catch (error) {
    console.error('Error handling image upload:', error);
    throw error;
  }
};



export { saveAudio, getAudioUrl, saveAudioComment, saveAudioConch, deleteAudioPost, saveSharePost, saveImage }
