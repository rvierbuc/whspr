import React from 'react';
import Login from './Login';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            {auth ? <h1>Private Routes</h1> : 
            <Navigate to="/"/>}
        </div>
    )
}

export default PrivateRoutes;