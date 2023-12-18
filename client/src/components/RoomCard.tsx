import React, {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const RoomCard = ({name, title, listeners, setRoomProps, id}) => {
    const navigate = useNavigate()
    useEffect(() => {
        setRoomProps(name, title, id)
        console.log('hi')
    }, [])

    const navigateTo = () => {
        navigate(`/protected/room/${name}`)
    }

    return (
        <div className='card'>
            <div className='card-body'>
                <button onClick={() => navigateTo()}>
                <h3>{title}</h3>

                </button>
                <h4>{name}</h4>
                <h5>Listeners: {listeners}</h5>

        </div>
        </div>
    )
}

export default RoomCard