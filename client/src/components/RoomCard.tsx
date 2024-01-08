import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const RoomCard = ({name, host, listeners, setRoomProps, id}) => {
    const navigate = useNavigate()
    useEffect(() => {
        console.log('hi')
    }, [])
    
    const navigateTo = () => {
        setRoomProps(name, host, id)
        navigate(`/protected/room/${name}`)
    }

  return (
        <div style={{margin: '10px'}} className='card'>
            <div className='card-body'>
                <button onClick={() => navigateTo()}>
                <h3>{name}</h3>

                </button>
                <h4>{host}</h4>
                <h5>Listeners: {listeners}</h5>

        </div>
        </div>
  );
};

export default RoomCard;