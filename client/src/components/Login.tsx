import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div>
            <Link to="/protected">
            <h1>Login</h1>
            </Link>
        </div>
    )
}

export default Login;