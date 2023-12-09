import React from 'react';
import Login from './Login';
import NavBar from './NavBar';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            <NavBar />
            {auth ? (
                <Outlet />
                ) :
            <Navigate to="/"/>}
        </div>
    )
}

export default PrivateRoutes;