import React from 'react'
import vahanLogo from '../assets/vahan-logo-blk.png';

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={vahanLogo} className='navbar-img' alt='logo'></img>
        <p className='navbar-text1'>Home</p>
        <p className='navbar-text2'>About Us</p>
        <p className='navbar-text3'>Contact Us</p>
    </div>
  )
}

export default Navbar;