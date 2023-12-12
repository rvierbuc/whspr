// hello_algolia.js
import algoliasearch from 'algoliasearch';
import { User } from './dbmodels'
//const axios = require('axios');
// Connect and authenticate with your Algolia app
const client = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4')

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
type searchable = {
  users: user[]
}
const sample = {
  objectID: "3",
  username:"george100",
  profileImgUrl: "https://lh3.googleusercontent.com/a/ACg8ocIh_Xb-SutpmLO8_8HPW3kfwBWUeelHOoFlSr_17TpR=s96-c"
}
const getUserData = async () => {
  try{ 
    const allUserData = await User.findAll({})
    const mappedUserData = allUserData.map((user) => user.dataValues)
    const saveObject = () => {
      //try{
        //mappedUserData.map((record) => 
        index.saveObject(sample 
        //   {
        //   autoGenerateObjectIDIfNotExist: true
        // }
        )
        .then((objectId) => console.log(objectId))
        .catch((error) => console.log(error))
        //)

      // }catch(error){
      //   console.log('save obj', error)
      // }
    } 
saveObject()
  }catch(error){
    console.log('error', error)
  }
}
getUserData()
// Search the index and print the results
// index
//   .search('Sydney')
//   .then(({ hits }) => console.log(hits[0]))
//   .catch((error) => console.log(error))