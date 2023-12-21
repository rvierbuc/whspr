import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from './RoomCard';
import Room from './Room';
import axios from 'axios';

const Radio = ({ setRoomProps }) => {
  const [radios, setRadios] = useState<any>([]);

  useEffect(() => {
    getRadios();
  }, []);

    

  const getRadios = async () => {
    try {
      const radios = await axios.get('/radio');
      console.log('radios', radios.data);
      setRadios(radios.data);
    } catch {
      console.log('couldnt get radios');
    }
  };

  return (
        <div>
            <button type='button' onClick={()=> {}}>
                Create Channel
            </button>

            {radios.map(radio => (<RoomCard 
            name={radio.host}
            title={radio.title}
            listeners={radio.listenerCount}
            setRoomProps={setRoomProps}
            id={radio.id}
            />
            ))}

            
        </div>
  );
};

export default Radio;