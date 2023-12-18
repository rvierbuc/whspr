import React from 'react';
import { Link } from 'react-router-dom';

const handleAuth = () => {
    window.location.href = '/auth/google';
}

const Login = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div>
            <img 
            src={require('../style/whspr-logo.png')}
            width={100}
            height={100}
            alt="whspr logo"
            onClick={() => handleAuth()}
            style={{cursor: 'pointer'}}
            />
            </div>
            <div>
            <button type='button' 
            className="btn btn-dark"
            onClick={()=> {handleAuth()}}>
                Login
            </button>
            </div>
        </div>
    )
}

export default Login;