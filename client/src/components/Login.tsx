import React from 'react';
import { Link } from 'react-router-dom';

const handleAuth = () => {
    window.location.href = '/auth/google';
}

const Login = () => {
    return (
        <div>
            <button type='button' onClick={()=> {handleAuth()}}>
                Login
            </button>
        </div>
    )
}

export default Login;