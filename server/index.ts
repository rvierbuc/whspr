// server index to set up port listen
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
