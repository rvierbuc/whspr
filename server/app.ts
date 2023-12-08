import path from "path";
import express from 'express'
import { Request, Response } from "express";
import http from 'http'
import {Server, Socket} from 'socket.io'
import {ExpressPeerServer} from 'peer'
import cors from 'cors'

const clientPath = path.resolve(__dirname, '../client/dist')

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}

const app = express();
const server = http.createServer(app)
const io = new Server(server)
// const peerServer = ExpressPeerServer(server, { path: '/peerjs'})

app.use(cors(corsOptions))
app.use(express.json());
// app.use('/peerjs', peerServer)
app.use(express.static(clientPath))

interface dataObj {
  userId: string,
  signal: string,
  from: string, 
  name: string
}

interface dataObj2 {
  to: string,
  signal: string,
 
}

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



//MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

module.exports = {
  server,
  io
};