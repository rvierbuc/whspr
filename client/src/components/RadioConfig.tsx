import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const RadioConfig = ({ setRoomProps }) => {
  const [select, setSelect] = useState([]);
  const [options, setOptions] = useState<AxiosResponse[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user: any = useLoaderData();
  const [show, setShow] = useState(false);
  //toast notifications
  const notifyChannelCreated = () => {
    toast.success('Channel Created!', {
      icon: '📻',
      style: {
        background: 'rgba(34, 221, 34, 0.785)',
      },
      position: 'top-right',
    });
  };
  
  const close = () => {
    setShow(false);
  };
  
  const open = () => {
    setShow(true);
  };

  const getFollowers = async () => {
    try {
      const followers = await axios.get(`/post/followers/${user.id}`);
      console.log('followers', followers);
      for (const i in followers.data) {
        const users = await axios.get(`/post/use/${followers.data[i].id}`);
        setOptions((pre) => [...pre, users.data]);
      }

    } catch {

    }
  };
  const channelChange = (e) => {
    setName(e.target.value);
  };

    const navigateTo = (room) => {
        if(name === ''){
            setError("Please name your channel")
        }else{
            console.log('create', user)
            setRoomProps(name, user.username, room.data.id, user)
            window.location.href = `/protected/room/${name}`;
            
        }
    }


  const createChannel = async () => {

    try {

      if (name !== '') {
        const room = await axios.post('/post/radio', { host: user.username, title: name });
    
        console.log('room', room);
        navigateTo(room);
        notifyChannelCreated();
      }
    } catch {

    }
  };

  const optionClick = (option) => {
    setSelect(option.username === select ? null : option.username);
  };
  useEffect(() => {
    getFollowers();
  }, []);
  return (
         <div>
        
            
                <button className='btn btn-dark' onClick={open}>Go Live</button>
                <Modal
                show={show}
                onHide={close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Name Your Channel</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                            type="text"
                            placeholder="Enter Your Channel Name"
                            value={name}
                            onChange={channelChange}
                            ></Form.Control>
                            <br/>
                            <div>
                            {error === null ? '' : error}
                            </div>
                            <button 
                        onClick={createChannel}
                        type="button"
                        className='btn btn-danger'
                        >
                            Create Channel
                        </button>
                        
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='btn btn-dark' onClick={close}>Close</button>
                        </Modal.Footer>
                    


                </Modal>
                

        </div>
  );
};

export default RadioConfig;