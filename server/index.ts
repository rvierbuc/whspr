// server index to set up port listen
import app from './app'
import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000
export const HOST = process.env.HOST || 'localhost'


app.listen(PORT, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}`)
})
