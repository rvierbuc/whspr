/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Router, Request, Response } from 'express'
import { saveAudio } from './google-cloud-storage'

const router = Router()

router.post('/upload', async (req: Request, res: Response) => {
  if (!req.file) {
    console.log('req.file.buffer is undefined in route upload.')
    res.sendStatus(400)
  } else {
    try {
      await saveAudio(req.file.buffer)
      res.status(200).send('Upload successful')
    } catch (error) {
      console.error('Error in upload router: ', error)
      res.status(500).send('Upload failed')
    }
  }
})

export default router
