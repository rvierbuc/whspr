const { Storage: GoogleCloudStorage } = require('@google-cloud/storage');
const path = require('path')

const storage = new GoogleCloudStorage({
    keyFilename: '../key.json',
    projectId: 'whspr-406622',
  });

  module.exports = storage;