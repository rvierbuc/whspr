import React from 'react';
import Login from './Login';
import NavBar from './NavBar';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            <NavBar />
            {auth ? <h1>Private Routes</h1> :
            <Navigate to="/"/>}

        </div>
    )
}

export default PrivateRoutes;