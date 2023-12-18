import React, {useEffect, useState} from 'react';
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Link,
    Routes,
    useLoaderData,
  } from 'react-router-dom';

import Login from './Login';
import Room from './Room'
import Radio from './Radio'
import PrivateRoutes from './PrivateRoutes';
import Synthesize from './Synthesize';
import WaveSurferComponent from './WaveSurfer';
import Feed from './Feed'
import PostCard from './PostCard'
import UserProfile from './userProfile';
import MagicConch from './MagicConch';
import ReadOnlyProfile from './ReadOnlyProfile';
import Post from './Post';
import axios from 'axios';

// THE MAIN audio context to be used throughout the application (DO NOT ALTER)
const audioContext: AudioContext = new AudioContext();
/**
 * If this is altered, Pixie will find you and haunt you in your sleep until you
 * learn to sleep with one eye open, and even then that won't be enough.
 */

const App = () => {
    const [channelName, setChannelName] = useState<string>();
    const [host, setHost] = useState<string>()
    const [uid, setUid] = useState<number>();

    const setRoomProps = (channelName, host, uid) => {
        setChannelName(channelName)
        setHost(host)
        setUid(uid)
    }

    const getUserLoader = async () => {
        try {
            const response = await axios.get('/current-user');
            console.log('responseloader', response);
            return response.data;
        } catch(err) {
            console.error('user loader error', err)
            return null;
        }
    }


    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path="/" element={<Login />} />
                <Route path="/protected" element={<PrivateRoutes />} >
                    <Route path="dashboard" element={<WaveSurferComponent />} /> // Outlet is a placeholder for child routes to be rendered


                    <Route path="profile" element={<UserProfile audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    <Route path="feed" element={<Feed audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    <Route path="synthesize" element={<Synthesize audioContext={audioContext} />} loader={() => getUserLoader()} />
                    <Route path="post" element={<PostCard audioContext={audioContext} />} loader={() => getUserLoader()}/>
                    <Route path="radio" element={<Radio setRoomProps={setRoomProps} />} />
                    <Route path="room/:name" element={<Room channel={channelName} host={host} id={uid}/>} />
                    <Route path="conch" element={<MagicConch audioContext={audioContext}/>}  loader={() => getUserLoader()}/>
                    <Route path="profile/:id" element={<ReadOnlyProfile audioContext={audioContext}/> } loader={() => getUserLoader()} />
                </Route>
             
            </Route>
        )
    )
    return (
        <RouterProvider router={router} />
    )
}

export default App;