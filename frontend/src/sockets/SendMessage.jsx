import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';

const SendMessage = () => {

    // const [msg, setMsg] = useState('');
    // const [socket, setSocket] = useState(io.connect('http://localhost:3000'));

    // const sendMsg = (e) => {
    //     e.preventDefault();

    //     socket.emit("send_message", {
    //         message: msg
    //     });
    // }   

    // useEffect(() => {

    //     socket.on("receive_message", (data) => {
    //         alert(data.message);
    //     });
    // }, [socket]);
    

  return (
    <div>
        <div>
            {/* <input type="text" name="message" onChange={(e) => setMsg(e.target.value)} />
            <button onClick={sendMsg}>Send</button> */}
        </div>
    </div>
  )
}

export default SendMessage