// hello_algolia.js
import algoliasearch from 'algoliasearch';
import { User } from './dbmodels'
//const axios = require('axios');
// Connect and authenticate with your Algolia app
//TO DO:
const client = algoliasearch('APP ID', 'Admin API Key');


// Create a new index and add a record
const index = client.initIndex('user_index')
type user =  {
  id: string;
  username: string;
  profileImgUrl: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}
//*****you don't need the autoGenerateObjectIDIfNotExist option if you can put an objectId key 
// in the obj you are sending--tested with this:*******
// const sample = {
//   objectID: "3",
//   username:"george100",
//   profileImgUrl: "https://lh3.googleusercontent.com/a/ACg8ocIh_Xb-SutpmLO8_8HPW3kfwBWUeelHOoFlSr_17TpR=s96-c"
// }
const getUserData = async () => {
  try{ 
    const allUserData = await User.findAll({})
    const mappedUserData = allUserData.map((user) => user.dataValues)

        mappedUserData.map(async (record) =>{
          try{
            await index.saveObject(record, {
              autoGenerateObjectIDIfNotExist: true
            })
          }catch(error){
            console.log('save obj', error)
          }
      })

  }catch(error){
    console.log('error', error)
  }
}
getUserData()
// Search the index and print the results
index
  .search('Sydney')
  .then(({ hits }) => console.log(hits[0]))
  .catch((error) => console.log(error))