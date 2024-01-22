/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Router, Request, Response } from 'express'
import multer from 'multer'
import { MagicConch, Radio, Post, Sound, User } from './dbmodels';
import { saveAudio, getAudioUrl, saveAudioComment, saveAudioConch, deleteAudioPost, saveImage, saveSharePost } from './google-cloud-storage'


const router = Router()
const upload = multer();

router.post('/upload', upload.single('audio'), async (req: Request, res: Response) => {
  const { userId, title, category } = req.body;
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      const downloadUrl = await saveAudio(req.file.buffer, userId, title, category)
      if (downloadUrl) {
        res.status(200).send(downloadUrl)
      }
    } catch (error) {
      console.error('Error in upload router: ', error)
      res.status(500).send('Upload failed')
    }
  }
})

router.post('/uploadComment', upload.single('audio'), async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      const downloadUrl = await saveAudioComment(req.file.buffer, userId, postId)
      if (downloadUrl) {
        res.status(200).send(downloadUrl)
      } else {
        res.status(500).send('Error retrieving download URL');
      }
    } catch (error) {
      console.error('Error in upload router: ', error)
      res.status(500).send('Upload failed')
    }
  }
})

router.post('/uploadSharePost', upload.single('audio'), async (req: Request, res: Response) => {
  const { sentFromId, sentToId, postId } = req.body;
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      const downloadUrl = await saveSharePost(req.file.buffer, sentFromId, sentToId, postId)
      if (downloadUrl) {
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

router.post('/conch', upload.single('audio'), async (req: Request, res: Response) => {
  const { sendingUserId, title, receivingUserId } = req.body;
  console.log('HEEEREEE', req.body)
  if (!req.file) {
    console.error('req.file is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {

      const downloadUrl = await saveAudioConch(req.file.buffer, sendingUserId, receivingUserId, title)
      if (downloadUrl) {
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
  const { receivingUser } = req.params
  try {
    const inbox = await MagicConch.findAll({ where: { receivingUserId: receivingUser }, include: {model: User, as: 'sentFromUser'} })
    console.log('ji', inbox)
    res.status(200).send(inbox)
  } catch {
    res.sendStatus(500)
  }

})

router.get('/conch/sent/:sendingUser', async (req: Request, res: Response) => {
  const { sendingUser } = req.params
  try {
    const inbox = await MagicConch.findAll({ where: { sendingUserId: sendingUser } })
    console.log('ji', inbox)
    res.status(200).send(inbox)
  } catch {
    res.sendStatus(500)
  }

})

router.get('/radio', async (req: Request, res: Response) => {
  try {
    const data = await Radio.findAll({})
    res.status(200).send(data)
  } catch {
    res.sendStatus(500)
  }
})

router.delete('/deletePost/:userId/:id', async (req: Request, res: Response) => {
  const { userId, id } = req.params;
  try {
    const data = await Post.findAll({ where: { userId: userId } });
    deleteAudioPost(userId, id);
    res.status(200).send(data)
  } catch {
    res.sendStatus(500);
  }
})

router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const { userId } = req.body;
    const imageUrl = await saveImage(req.file.buffer, req.file.mimetype, userId);

    await User.update({ profileImgUrl: imageUrl }, { where: { id: userId } });
    res.status(200).send({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});

  router.post('/testing', async (req: Request, res: Response) => {
    const {sendingUserId, receivingUserId, title, soundUrl} = req.body
    try{
      const testConch = await MagicConch.create({sendingUserId, receivingUserId, title, soundUrl})
      res.sendStatus(201)
    } catch(error) {
      console.error(error)
    }

  })
export default router
