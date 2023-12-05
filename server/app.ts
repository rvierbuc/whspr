import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/consistent-type-imports
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

const app = express()
app.use(cors())
app.use(upload.single('audio'))
app.use(express.json())
app.use(express.static(clientPath))
app.use('/', routes)

// MAKE SURE THIS IS LAST
app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

export default app
