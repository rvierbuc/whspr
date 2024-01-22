import React, { useEffect, useState } from 'react';
import Login from './Login';
import NavBar from './NavBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import socket from './socket';

const PrivateRoutes = () => {
  const auth = true;
  const user: any = useLoaderData();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const getNotificationCount = async () => {
    try {
      const notificationArr = await axios.get(`/post/shared/${user.id}/notification`);
      setNotificationCount(notificationArr.data.length);
    } catch (error) {
      console.error('could not get notification count', error);
    }
  };
  socket.on('sharedPost-notification', (notificationObj) => {
    //console.log('shared post notification', notificationObj);
    setNotificationCount(notificationObj.notificationAmt);
  });
  useEffect(() => {
    getNotificationCount();
  });
  return (
        <div>
            <NavBar 
            notificationCount={notificationCount} 
            getNotificationCount={getNotificationCount} 
            setNotificationCount={setNotificationCount}

            />
            {auth ? (
                <Outlet />
                // <div>ok</div>
            ) :
            <Navigate to="/"/>}
        </div>
  );
};

export default PrivateRoutes;