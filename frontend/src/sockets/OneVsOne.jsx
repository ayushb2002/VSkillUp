import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OneVsOne = () => {

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
                <span className='text-3xl'>One vs One challenge!</span>
            </div>
            <div>
                
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default OneVsOne