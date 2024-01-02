import React, {useState, useEffect} from 'react'
import axios, { AxiosResponse } from 'axios'
import { useLoaderData, useNavigate } from 'react-router-dom';

const RadioConfig = ({setRoomProps}) => {
    const [select, setSelect] = useState([])
    const [options, setOptions] = useState<AxiosResponse[]>([])
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const user: any = useLoaderData();

    useEffect(() => {
        getFollowers()
    }, [])

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

    const createChannel = async () => {

        try {

            const room = await axios.post('/post/radio', {host: user.username, title: name, })

            console.log('room', room)
            
            setRoomProps(name, user.username, room.data.id)
            navigate(`/protected/room/${name}`)
        }catch {

        }
    }

    const optionClick = (option) => {
        setSelect(option.username === select ? null : option.username)
    }
    return (
        <div>
            <h1>Configure Your Channel</h1>
            <span>
                <h3>Channel Name</h3>
                
                <input className='whaa' onChange={(e) => {channelChange(e)}}></input>
            </span>

            {/* <span>
                <h3>Speaking Guests (up to 5)</h3>
            </span> */}

                {/* <div className="selectable-box">
                    {options.map((option) => (
                        <div
                        className={`option ${select === option.username ? 'selected' : ''}`}
                        onClick={() => optionClick(option)}
                        >{option.username}</div>
                    ))}
                </div> */}
                        <button 
                        onClick={() => createChannel()}
                        type="button"
                        className='btn btn-dark'
                        >
                            Create Channel
                        </button>
                <div>
                    
                </div>

        </div>
    )
}

export default RadioConfig