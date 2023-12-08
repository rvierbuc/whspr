import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState({});
    // const userLoader = useLoaderData();
    // console.log('userLoader');
    return (
        <div className="user-main">
            <h1>test</h1>
          
        </div>
    )
};

export default UserProfile;