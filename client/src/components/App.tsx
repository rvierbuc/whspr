import React, { useState, lazy } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Radio from './Radio';
const Login = lazy(() => import('./Login'));
const Room = lazy(() => import('./Room'));
const PrivateRoutes = lazy(() => import('./PrivateRoutes'));
const WaveSurferComponent = lazy(() => import('./WaveSurfer'));
const Feed = lazy(() => import('./Feed'));
const UserProfile = lazy(() => import('./userProfile'));
const MagicConch = lazy(() => import('./MagicConch'));
const ReadOnlyProfile = lazy(() => import('./ReadOnlyProfile'));
// import Search from './Search';
const Synthesize = lazy(() => import('./Synthesize'));
//import socket from './socket';
import axios from 'axios';
import { WhsprAI } from './WhsprAI';
import aa from 'search-insights';
import { v4 as uuidv4 } from 'uuid';


// THE MAIN audio context to be used throughout the application (DO NOT ALTER)
const audioContext: AudioContext = new AudioContext();
// algolia initialization
aa('init', {
  appId: '2580UW5I69',
  apiKey: 'b0f5d0cdaf312c18df4a45012c4251e4',
});
const generateUserToken = (): string => {
  return uuidv4();
};

const userToken = generateUserToken();

aa('setUserToken', userToken);


const App = () => {
  const [channelName, setChannelName] = useState<string>();
  const [host, setHost] = useState<string>();
  const [uid, setUid] = useState<number>();
  const [creator, setCreator] = useState<any>();
  //const [inboxNotiCount, setInboxNotiCount] = useState<number>(0)
  const setRoomProps = (channelName: string, host: string, uid: number) => {
    setChannelName(channelName);
    setHost(host);
    setUid(uid);
    setCreator(creator);
  };

  const getUserLoader = async () => {
    try {
      const response = await axios.get('/current-user');
      //console.log('getUserLoader', response.data)
      return response.data;
    } catch (err) {
      console.error('user loader error', err);
      return null;
    }
  };
  //console.log('current user', currUser);
 


  // socket.on('sharedPost-notification', async (notificationObj) => {
  //   const { sentToUser, notificationAmt } = notificationObj;
  //   try {
  //     const user = await getUserLoader();
  //     console.log('getUserLoader', user.id === sentToUser);
  //     //if (user.id === sentToUser) {
  //       console.log('curr user', notificationAmt)
  //       setInboxNotiCount(notificationAmt);
  //     //}
  //   } catch (error) {
  //     console.error('shared post notification error', error);
  //   }
  //   //if(sentToUser === )
    
  // });


  const router = createBrowserRouter(
    createRoutesFromElements(

            <Route>
                <Route path="/" element={<Login />} />
                <Route path="/protected" element={<PrivateRoutes/>} loader={() => getUserLoader()} >
                    <Route path="dashboard" element={<WaveSurferComponent />} />
                    <Route path="WhsprAI" element={<WhsprAI audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    {/* <Route path="search" element={<Search />} /> */}
                    <Route path="profile" element={<UserProfile setRoomProps={setRoomProps} audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    <Route path="feed/:type" element={<Feed audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    {/* <Route path="post" element={<PostCard />} loader={() => getUserLoader()}/> */}
                    <Route path="synthesize" element={<Synthesize audioContext={audioContext} />} loader={() => getUserLoader()} />
                    <Route path="radio" element={<Radio setRoomProps={setRoomProps} />} />
                    <Route path="room/:name" element={<Room audioContext={audioContext} channel={channelName} host={host} id={uid} creator={creator}/>} loader={() => getUserLoader()}/>
                    <Route path="inbox" element={<MagicConch audioContext={audioContext}/>} loader={() => getUserLoader()}/>
                    <Route path="feed/profile/:id" element={<ReadOnlyProfile audioContext={audioContext}/> } loader={() => getUserLoader()} />
                </Route>
            </Route>,

    ),
  );
  return (
    <RouterProvider router={router} />
  );
};

export default App;