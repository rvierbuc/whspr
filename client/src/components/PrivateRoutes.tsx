import React from 'react';

const PrivateRoutes = () => {
    const auth = true;
    return (
        <div>
            {auth ? <h1>Private Routes</h1> : <h1>Not Authenticated</h1>}
        </div>
    )
}

export default PrivateRoutes;