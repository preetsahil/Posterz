import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Hero.scss"
function Hero() {
    const navigate=useNavigate();
  return (
    <div className='Hero'>
        <div className='hero-content center'>
            <h2 className='heading'>Exclusive Print and Artwork</h2>
            <p className='subheading'>
                Exclusive Art Pieces, for the Exclusive You.
            </p>
            <button className='cta btn-primary'> Explore more</button>
        </div>
    </div>
  )
}

export default Hero