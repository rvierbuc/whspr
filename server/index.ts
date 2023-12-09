// server index to set up port listen

//import dotenv from 'dotenv'

//dotenv.config()
import server from './app';
//equire('dotenv').config();

const PORT =  3000


server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
