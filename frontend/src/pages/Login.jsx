import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    try
    {
      const formData = new FormData();
      formData.append('email', `${email}`);
      formData.append('password', `${password}`);

      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if(result['success'])
      {
        toast.success('Signed in!');
        sessionStorage.setItem('loggedIn', true);
        const userData = await fetch('http://127.0.0.1:5000/welcome', 
        {
          method: 'GET'
        })
        const data = await userData.json();
        console.log(data);
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      }
      else
      {
        toast.error('User not registered or password is incorrect!');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
    catch(err)
    {
      console.log(err);
      toast.error('Server error!');
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    }
  }

  return (
    <div>
      <Navbar />
      <section>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign in!</h1>
            <p className="py-6">Continue your journey and get help at every step you take. You just gotta ask!</p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:mr-36">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input type="email" placeholder="johnDoe@example.com" className="input input-bordered" onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="We hope you remember!" className="input input-bordered" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-success" onClick={signIn}>Sign in</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </div>
  )
}

export default Login