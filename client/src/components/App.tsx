import React, {useEffect} from 'react';
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
import PrivateRoutes from './PrivateRoutes';
import Synthesize from './Synthesize';
import WaveSurferComponent from './WaveSurfer';
import Feed from './Feed'
import Post from './PostCard'
import UserProfile from './userProfile';
import axios from 'axios';

// THE MAIN audio context to be used throughout the application (DO NOT ALTER)
const audioContext: BaseAudioContext = new AudioContext();
/**
 * If this is altered, Pixie will find you and haunt you in your sleep until you
 * learn to sleep with one eye open, and even then that won't be enough.
 */

const App = () => {
    const getUserLoader = async () => {
        try {
            const response = await axios.get('/current-user');
            console.log('responseloader', response);
            return response.data;
        } catch(err) {
            console.error('user loader error', err)
        }
    }


    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path="/" element={<Login />} />
                <Route path="/protected" element={<PrivateRoutes />} >
                    <Route path="dashboard" element={<WaveSurferComponent />} /> // Outlet is a placeholder for child routes to be rendered
                    <Route path="profile" element={<UserProfile />} loader={() => getUserLoader()}/>
                </Route>
                <Route path="/protected/synthesize" element={<Synthesize audioContext={audioContext} />} />
                <Route path="/protected/post" element={<Post audioContext={audioContext} />} />
                <Route path="/protected/feed" element={<Feed audioContext={audioContext} />} />
            </Route>
        )
    )
    return (
        <RouterProvider router={router} />
    )
}

export default App;