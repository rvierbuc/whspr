/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Router, Request, Response } from 'express'
import { saveAudio, getAudioUrl, saveAudioComment, saveAudioConch } from './google-cloud-storage'
import { MagicConch, Radio } from './dbmodels';

const router = Router()

router.post('/upload', async (req: Request, res: Response) => {
const {userId, title, category} = req.body;
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      const downloadUrl = await saveAudio(req.file.buffer, userId, title, category)
      if(downloadUrl){
        res.status(200).send(downloadUrl)
      }
    } catch (error) {
      console.error('Error in upload router: ', error)
      res.status(500).send('Upload failed')
    }
  }
})

router.post('/uploadComment', async (req: Request, res: Response) => {
  const {userId, postId} = req.body;
    if (!req.file) {
      console.error('req.file is undefined in route upload.')
      res.sendStatus(400)
    } else {
      try {
        const downloadUrl = await saveAudioComment(req.file.buffer, userId, postId)
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

router.post('/conch', async (req: Request, res: Response) => {
  const {sendingUserId, title, receivingUserId} = req.body;
    if (!req.file) {
      console.error('req.file is undefined in route upload.')
      res.sendStatus(400)
    } else {
      try {

        const downloadUrl = await saveAudioConch(req.file.buffer, sendingUserId, receivingUserId, title)
        if(downloadUrl){
          console.log('postconch')
          res.status(200).send(downloadUrl)
        }
      } catch (error) {
        console.error('Error in upload router: ', error)
        res.status(500).send('Upload failed')
      }
    }
  })

  router.get('/conch/:receivingUser', async (req: Request, res: Response) => {
    const {receivingUser} = req.params
    try{
      const inbox = await MagicConch.findAll({where: {receivingUserId: receivingUser}})
      console.log('ji', inbox)
      res.status(200).send(inbox)
    }catch{
      res.sendStatus(500)
    }

  })

  router.get('/conch/sent/:sendingUser', async (req: Request, res: Response) => {
    const {sendingUser} = req.params
    try{
      const inbox = await MagicConch.findAll({where: {sendingUserId: sendingUser}})
      console.log('ji', inbox)
      res.status(200).send(inbox)
    }catch{
      res.sendStatus(500)
    }

  })

  router.get('/radio', async (req: Request, res: Response) => {
    try{
      const data = await Radio.findAll({})
      res.status(200).send(data)
    }catch{
      res.sendStatus(500)
    }
  })
  

export default router
