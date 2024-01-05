import React, {useState, useEffect} from 'react'
import axios, { AxiosResponse } from 'axios'
import { useLoaderData, useNavigate } from 'react-router-dom';
import {Modal, Form} from 'react-bootstrap'

const RadioConfig = ({setRoomProps}) => {
    const [select, setSelect] = useState([])
    const [options, setOptions] = useState<AxiosResponse[]>([])
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const user: any = useLoaderData();
    const [show, setShow] = useState(false)



    useEffect(() => {
        getFollowers()
    }, [])

    const close = () => {
        setShow(false)
    }

    const open = () => {
        setShow(true)
    }

    const getFollowers = async () => {
        try{
            const followers = await axios.get(`/post/followers/${user.id}`)
            console.log('followers', followers)
            for(let i in followers.data){
                console.log('iii')
                const users = await axios.get(`/post/use/${followers.data[i].id}`)
                console.log('usee', users)
                setOptions((pre) => [...pre, users.data])
            }

        } catch {

        }
    }
    const channelChange = (e) => {
        setName(e.target.value)
    }

    const navigateTo = (room) => {
        if(name === ''){
            setError("Please name your cahnnel")
        }else{
            console.log('name', name)
            setRoomProps(name, user.username, room.data.id)
            
        }
        navigate(`/protected/room/${name}`)
    }


    const createChannel = async () => {

        try {

            const room = await axios.post('/post/radio', {host: user.username, title: name, })

            console.log('room', room)
            navigateTo(room)
        }catch {

        }
    }

    const optionClick = (option) => {
        setSelect(option.username === select ? null : option.username)
    }
    return (
         <div>
        
            
                <button className='btn btn-dark' onClick={open}>Go Live</button>
                <Modal
                show={show}
                onHide={close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Choose Your Channel Type</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                            type="text"
                            placeholder="Enter Your Channel Name"
                            value={name}
                            onChange={channelChange}
                            ></Form.Control>
                            <br/>
                            <button 
                        onClick={createChannel}
                        type="button"
                        className='btn btn-danger'
                        >
                            Create Channel
                        </button>
                        {error === null ? "" : error}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='btn btn-dark' onClick={close}>Close</button>
                        </Modal.Footer>
                    


                </Modal>
                

        </div>
    )
}

export default RadioConfig