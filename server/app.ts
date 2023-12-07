
import path from 'path'
import express, { Request, Response } from 'express'
import multer from 'multer'
import routes from './routes'
// const db = require('./db')
// const express = require('express')
// const session = require('express-session')
import cors from 'cors'
const clientPath = path.resolve(__dirname, '../client/dist')
const storage = multer.memoryStorage();
const upload = multer({storage: storage})
import { Sound, Post } from './dbmodels'
const app = express()
const session = require('express-session');
const crypto = require('crypto');
const passport = require('passport');
require('./auth');
const secret = crypto.randomBytes(64).toString('hex'); //secret hash for session

app.use(cors())
app.use(upload.single('audio'))
app.use(express.json())
app.use(express.static(clientPath))
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}))

app.use('/', routes)

//AUTHENTICATION ROUTES
app.get('/auth/google', (req: Request, res: Response) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })
})

app.get('/google/callback', async (req: Request, res: Response) => {
  try {
    await passport.authenticate('google', { failureRedirect: '/login' })
    res.redirect('/protected')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
})


app.get('/getSoundURLPostId',  async (req, res) =>{
  const {postId} = req.query;
  if(!postId){
    console.error('post Id is undefined or null')
    res.send('post Id is undefined or null').status(400);
    return;
  }
  try{
    const soundRecord = await Sound.findOne({where: {postId}});
    if(!soundRecord){
      console.error('Sound record not found.')
      res.send('Sound record not found.').status(404);
      return
    }
    const audioId = soundRecord.get('soundURL');
    if(audioId){
      res.status(200).send({audioId});
    }
  }catch(error){
    console.error('Nonspecific error retrieving audio id:', error);
    res.send('Nonspecific error retrieving audio id.').status(500)
  }
  })

app.post('/createPostRecord', async(req, res) =>{
    try{
      const postRecord = {
      userId: req.body.userId,
      title: req.body.title,
      category: req.body.category,
      audioId: 1
    }
      await Post.create(postRecord)
      res.status(200).send('Post record created.')
    }catch(error){
      res.status(500).send('Nonspecific error in post create')
    }
  })

// MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

export default app
