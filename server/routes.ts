/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Router, Request, Response } from 'express'
import { saveAudio, getAudioUrl } from './google-cloud-storage'
import {Post} from './dbmodels'

const router = Router()

router.post('/upload/:postId/:userId', async (req: Request, res: Response) => {
const {postId, userId} = req.params
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      const downloadUrl = await saveAudio(req.file.buffer, postId, userId)
      if(downloadUrl){
        res.status(200).send(downloadUrl)
      }
    } catch (error) {
      console.error('Error in upload router: ', error)
      res.status(500).send('Upload failed')
    }
  }
})

router.get('/getAudio', async (req: Request, res: Response) => {
  const { postId } = req.query;

  if (!postId) {
    console.error('postId is undefined or null');
    res.status(400).send('postId is undefined or null');
    return;
  }

  try {
    const audioUrl = await getAudioUrl(Number(postId));
    if (audioUrl) {
      res.status(200).send({ audioUrl });
    } else {
      res.status(404).send('Audio not found');
    }
  } catch (error) {
    console.error('Error fetching audio:', error);
    res.status(500).send('Error fetching audio');
  }
});

// router.get('/getAudioAndStore/:postId', async (req: Request, res: Response) => {
//   try{
//     const postId = req.params.postId
//     const postRecord = await Post.findOne({where: {postId}})
//     if(!postRecord){
//       res.status(404).send('Post not found')
//     }
//     const soundURL = postRecord?.get('soundURL') as string;
//     if(!soundURL){
//       res.status(404).send('SoundURL not found')
//     }
//     const fileName = soundURL.split('/').pop()
//     const localFilePath = path.join()
//   }
// });

export default router
