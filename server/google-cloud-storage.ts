const { Storage: GCStorage } = require('@google-cloud/storage');
const path = require('path')

const storage = new GCStorage({
    keyFilename: '../key.json',
    projectId: 'whspr-406622',
  });

  module.exports = storage;