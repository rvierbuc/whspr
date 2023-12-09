/* eslint-disable @typescript-eslint/no-misused-promises */
import { Storage } from '@google-cloud/storage'
import { Post, Sound } from './dbmodels'
const storage = new Storage({
  keyFilename: './key.json',
  projectId: 'whspr-406622'
})

const bucket = storage.bucket('whspr-sounds')

const saveAudio = async (audio: any): Promise<void | string> => {
  try {
    const file = bucket.file(`audio/${Date.now()}.wav`)
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`
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
        userId: 1, 
        postId: 1, 
        soundUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
    ])
    return downloadURL;
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
    if(!soundUrl){
      console.error('Audio URL not found.')
    }
    return soundUrl;
  } catch (error) {
    console.error('Error retrieving audio URL:', error);
    return null;
  }
};

export { saveAudio, getAudioUrl }
