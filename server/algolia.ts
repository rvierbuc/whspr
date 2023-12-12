// require('dotenv').config();
// hello_algolia.js
import algoliasearch from 'algoliasearch';
import { User } from './dbmodels'
//const axios = require('axios');
// Connect and authenticate with your Algolia app
//TO DO:
// interface EnvironmentVariables {
//   APP_ID: string;
//   ADMIN_API_KEY: string;
// }
// const { APP_ID, ADMIN_API_KEY }: EnvironmentVariables = process.env as any;

const client = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4');


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
// index
//   .search('Sydney')
//   .then(({ hits }) => console.log('then', hits)) //this is not working right now 
//   .catch((error) => console.log('catch', error))

const searchIndex = client.initIndex('search_index');

const getSearchData = async () => {
  try{ 
    const allUserData = await User.findAll({})
    const mappedUserData = allUserData.map((user) => user.dataValues)

        mappedUserData.map(async (record) =>{
          try{
            await searchIndex.saveObject(record, {
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
getSearchData();

searchIndex.setSettings({
  searchableAttributes: [
    'username',
  ]
}).then(() => {
  console.log('set settings')
}).catch((error) => {
  console.log('error', error)
})
searchIndex
.search('Daniel')
.then(({ hits }) => console.log('then', hits)) //this is not working right now
.catch((err) => console.log('catch', err));



