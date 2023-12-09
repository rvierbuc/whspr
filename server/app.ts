import path from 'path'
import express, { Request, Response } from 'express'
import multer from 'multer'
import routes from './routes'
// const db = require('./db')
// const express = require('express')
// const session = require('express-session')
import cors from 'cors'
import http from 'http'
import {Server, Socket} from 'socket.io'
import {ExpressPeerServer} from 'peer'

const clientPath = path.resolve(__dirname, '../client/dist')

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}
const storage = multer.memoryStorage();
const upload = multer({storage: storage})


const userRoutes = require('./routes/userRoutes')
import { Sound, Post } from './dbmodels'
const app = express()
app.use(cors())
app.use(upload.single('audio'))
const routeHandler = express.Router()
const server = http.createServer(app)
const io = new Server(server)
// const peerServer = ExpressPeerServer(server, { path: '/peerjs'})

app.use(cors(corsOptions))
app.use(express.json())
// app.use('/peerjs', peerServer)
app.use(express.static(clientPath))

routeHandler.use('/user', userRoutes)
app.use('/', routeHandler)
app.use('/', routes)




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
    const soundUrl = soundRecord.get('soundUrl');
    if(soundUrl){
      res.status(200).send({soundUrl});
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
      soundUrl: req.body.soundUrl
    }
      await Post.create(postRecord)
      res.status(200).send('Post record created.')
    }catch(error){
      res.status(500).send('Nonspecific error in post create')
    }
  })

  
// io.on('connection', (socket: Socket) => {
//   console.log('Socket connected! ID: ', socket.id)
//   socket.emit('id', socket.id)

//   socket.on('disconnect', () => {
//     console.log('User disconnected')
//     io.emit('disconnected', socket.id)
//   })
  
//   socket.on('call', (data: dataObj) => {
//     console.log('joined')
//     io.to(data.userId).emit('call', {signal: data.signal, from: data.from, name: data.name})
//   })

//   socket.on('answer', (data: dataObj2) => {
//     io.to(data.to).emit('accept', data.signal)
//   })

// })

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-channel', (channelName, uid) => {
    socket.join(channelName);
    io.to(channelName).emit('user-joined', uid);
  });

  socket.on('leave-channel', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      socket.leave(room);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

export default server
