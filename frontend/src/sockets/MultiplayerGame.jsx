import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const MultiplayerGame = () => {
    
    const { roomId } = useParams();
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [socket, setSocket] = useState(io.connect('http://localhost:3000'));
    const [answer, setAnswer] = useState('');
    const [messages, setMessages] = useState([]);
    const [populate, setPopulate] = useState(messages.map(message => <li>{message}</li>));

    useEffect(() => {
        if(sessionStorage.getItem('loggedIn') != "true")
        {
            window.location.href = '/logout';
        }
        else
        {
            setLoggedIn(true);
        }

        socket.on(`receive_message_${roomId}`, (data) => {
            messages.push(data.message);
            console.log(data.message);
            console.log(messages);
        });
        
        setPopulate(messages.map((message, index)=> <li key={index}>{message}</li>));
    }, [socket]);

    const leaveRoom = (e) => {
        e.preventDefault();
        socket.emit('disconnectRoom', {roomId: roomId, user:email});
        window.location.href = '/game';
    }

    const sendMessage = (e) => {
        e.preventDefault();
        messages.push(answer);
        socket.emit("send_message", {message: answer, roomId: roomId});
    }

  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-3 p-5'>
            <div className='col-span-3 p-5 flex justify-center'>
                <span className='text-3xl font-bold'>Multiplayer Game Room - {roomId}!</span>
            </div>
            <div className='col-span-3 flex justify-end'>
                <button onClick={leaveRoom} className='btn'>Leave</button>
            </div>
            <div className='col-span-2'></div>
            <div className='grid grid-rows-2 p-5'>
                <div className='p-5'>
                    <ul>
                        {populate}
                    </ul>
                </div>
                <div className=''>
                    <form onSubmit={sendMessage}>
                        <div className='form-control'>
                            <label htmlFor="message">
                                <span className='label-text'>Message</span>
                            </label>
                            <input type="text" name="message" className='input input-bordered' onChange={(e) => setAnswer(e.target.value)} />
                        </div>
                        <div className='form-control mt-2'>
                            <button type='submit' className='btn btn-success w-[7vw]'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default MultiplayerGame