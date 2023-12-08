// server index to set up port listen
const { server } = require('./app');
// require('dotenv').config();

const PORT = 3000;


server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
