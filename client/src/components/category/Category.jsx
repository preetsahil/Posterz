import React from 'react'
import "./Category.scss"
function Category({image}) {
  return (
    <div className='Category' style={{
        backgroundImage:`url(${image})`
    }}>
        <div className="category-content center">
            <h3 className='heading'>
                Anime
            </h3>
        </div>
    </div>
  )
}

export default Category