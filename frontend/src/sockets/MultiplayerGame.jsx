import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';

const MultiplayerGame = () => {
    
    const { roomId } = useParams();
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }
    }, []);

  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-3 p-5'>
            <div className='col-span-3 p-5 flex justify-center'>
                <span className='text-3xl font-bold'>Multiplayer Game Room - {roomId}!</span>
            </div>
            <div>

            </div>
        </div>
        <Footer />
    </div>
  )
}

export default MultiplayerGame