// require('dotenv').config();
// hello_algolia.js
import algoliasearch from 'algoliasearch';
import { User, Post } from './dbmodels'
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
  // googleId: string; sensitive info
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
// Search the index and print the results
// index
//   .search('Sydney')
//   .then(({ hits }) => console.log('then', hits)) //this is not working right now 
//   .catch((error) => console.log('catch', error))

const searchIndex = client.initIndex('search_index');

const getSearchData = async () => {
  try {
    //query the post table for all posts, cross reference with user table to get username
    const allPostData = await Post.findAll({
      // use include to get the user data from the user table as the keyword 'user'
      include: [{
        model: User,
        as: 'user'
      }]
    })
    // console.log('allPostData', allPostData);
    //map over the data to get dataValues
    const mappedPostData = allPostData.map((post) => post.dataValues)
    // console.log('mappedPostData', mappedPostData);
    //grab the username from the user object
    const mappedPostDataWithUsername = mappedPostData.map((post) => {
      //set the username key to the username value from the user object
      post.username = post.user.username;
      // return the post that now has a username key
      return post;
    })
    //map through the data 
    mappedPostDataWithUsername.map(async (record) =>{
      try{
        // console.log('record log', record); this successfully logs everything from the post + the associated user record with the username
        // extract the values we want to save to the search index instead of all the data from the post and user tables
        const valuesToSave = {
          title: record.title,
          category: record.category,
          username: record.username,
          objectID: record.id,
          soundUrl: record.soundUrl
        }
        // save the values to the search index
        await searchIndex.saveObject(valuesToSave, {
          autoGenerateObjectIDIfNotExist: true
        })
      }catch(error){
        console.log('save obj', error)
      }
    })
  } catch(error) {
    console.error('error', error);
  }
}
// set the settings for the search index to be able to search by username, title, and category
const setSearchIndexSettings = async () => {
  try {
    await searchIndex.setSettings({
      searchableAttributes: [
        'username',
        'title',
        'category'
      ]
    });
    console.log('set settings');
  } catch (error) {
    console.log('error', error);
  }
};
getSearchData();
getUserData();
setSearchIndexSettings();
// searchIndex
// .search('Daniel')
// .then(({ hits }) => console.log('then', hits)) 
// .catch((err) => console.log('catch', err));

//delete index, uncomment these when you want to delete everything and reset to see the indices
// searchIndex.delete().then(() => {
//   console.log('index deleted')
// }).catch((error) => {
//   console.log('error', error)
// })
// index.delete().then(() => {
//   console.log('user index deleted')
// }).catch((error) => {
//   console.log('error', error)
// })

