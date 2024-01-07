import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard';
import Room from './Room';
import axios from 'axios'


const Radio = ({setRoomProps}) => {
    const [radios, setRadios] = useState<any>([])
    const navigate = useNavigate()

    useEffect(() => {
        getRadios()
    }, [])
    

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
        <div style={{ alignItems: 'center', marginTop: '50px'}}>
           

            {radios.map(radio => (<RoomCard 
            name={radio.title}
            host={radio.host}
            listeners={radio.listenerCount}
            setRoomProps={setRoomProps}
            id={radio.id}
            />
            ))}

            
        </div>
  );
};

export default Radio;