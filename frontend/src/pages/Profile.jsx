import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [level, setLevel] = useState(sessionStorage.getItem('level'));
  const [age, setAge] = useState(sessionStorage.getItem('age'));
  const [education, setEducation] = useState(sessionStorage.getItem('education'));
  const [fname, setFname] = useState(sessionStorage.getItem('given_name'));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [lname, setLname] = useState(sessionStorage.getItem('family_name'));

  useEffect(() => {
    if(sessionStorage.getItem('loggedIn') != "true")
    {
      window.location.href = '/logout';
    }
  }, [])

  return (
    <div>
      <Navbar />
      <section>
        <div className='p-10 grid grid-cols-4'>
          <div className='p-5 col-span-4 text-center'>
            <span className='text-3xl'>Profile</span>
          </div>
          <div></div>
          <div className='col-span-3'>
            <table className='table'>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Age</th>
                  <th>Education</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fname}</td>
                  <td>{lname}</td>
                  <td>{email}</td>
                  <td>{age}</td>
                  <td>{education}</td>
                  <td>{level}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Profile