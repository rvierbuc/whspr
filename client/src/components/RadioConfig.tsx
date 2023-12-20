import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useLoaderData } from 'react-router-dom';

const RadioConfig = () => {
    const [select, setSelect] = useState(null)
    const [options, setOptions] = useState([])
    const user: any = useLoaderData();

    useEffect(() => {
        getFollowers()
    }, [])

    const getFollowers = async () => {
        try{
            const followers = await axios.get(`/post/followers/${user.id}`)
            console.log('followers', followers)
            setOptions(followers.data)
        } catch {

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
                
                <input className='whaa'></input>
            </span>

            <span>
                <h3>Speaking Guests (up to 5)</h3>
                
                <input className='whaa'></input>
            </span>

                <div className="selectable-box">
                    {options.map((option) => (
                        <div
                        className={`option ${select === option.username ? 'selected' : ''}`}
                        onClick={() => optionClick(option)}
                        >{option.username}</div>
                    ))}
                </div>

        </div>
    )
}

export default RadioConfig