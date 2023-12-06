import React from 'react';
import Login from './Login';
import NavBar from './NavBar';
import { Navigate, Outlet } from 'react-router-dom';
import PostItem from './PostItem'

const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            <NavBar />
            {auth ? (
                <Outlet />
                ) :
            <Navigate to="/"/>}
            <PostItem/>
        </div>
    )
}

export default PrivateRoutes;