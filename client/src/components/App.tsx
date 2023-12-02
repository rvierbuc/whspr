import React from 'react';
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Outlet,
    Link,
    Routes,
    useLoaderData,
  } from 'react-router-dom';

import Login from './Login';
import PrivateRoutes from './PrivateRoutes';


const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path="/" element={<Login />} />
                <Route path="/protected" element={<PrivateRoutes />} >
                    <Route path="dashboard" element={<Outlet />} /> // Outlet is a placeholder for child routes to be rendered
                    </Route>
            </Route>
        )
    )
    return (
        <RouterProvider router={router} />
    )
}

export default App;