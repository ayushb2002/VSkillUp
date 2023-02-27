import React from 'react'

const Navbar = () => {
  return (
    <div>
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">VSkillUp</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li><a href='/'>Home</a></li>
                <li tabIndex={0}>
                    <a>
                    Explore
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                    </a>
                    <ul className="p-2 bg-base-100">
                    <li><a href='/learn'>Learn</a></li>
                    <li><a href='/dailyChallenge'>Daily Challenge</a></li>
                    </ul>
                </li>
                <li><a href='/login'>Login</a></li>
                <li><a href='/register'>Register</a></li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar