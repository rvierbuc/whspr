import React from 'react';
import Login from './Login';
import NavBar from './NavBar';
import { Navigate } from 'react-router-dom';
import PostItem from './PostItem'
const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            <NavBar />
            {auth ? <h1>Private Routes</h1> :
            <Navigate to="/"/>}
            <PostItem/>
        </div>
    )
}

export default PrivateRoutes;