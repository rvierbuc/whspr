/* eslint-disable @typescript-eslint/no-misused-promises */
import { Storage } from '@google-cloud/storage'
import {Sound} from './dbmodels'
const storage = new Storage({
  keyFilename: './key.json',
  projectId: 'whspr-406622'
})

const bucket = storage.bucket('whspr-sounds')

const saveAudio = async (audio: any): Promise<void> => {
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
        recordingUrl: downloadURL,
      }).catch((soundError) => {
        console.error('Error creating Sound record:', soundError);
      }),
    ]);    
  } catch (error) {
    console.error('Error handling audio upload:', error)
  }
}

export { saveAudio}
