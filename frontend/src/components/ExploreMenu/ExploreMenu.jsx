import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';

const ExploreMenu = ({category,setCategory}) => {
  const {menuCategories, url} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="explore-menu-list">
        {menuCategories.length === 0 ? (
          <p style={{padding:'1rem',color:'#888'}}>No categories found.</p>
        ) : menuCategories.map((cat, index) => (
          <div onClick={() => setCategory(prev => prev === cat.name ? "All" : cat.name)} key={index} className='explore-menu-list-item'>
            <div className={`menu-icon-circle${category === cat.name ? ' active' : ''}`}>
              <img src={cat.image ? `${url}/images/${cat.image}` : assets.menu_1} alt="" onError={e => { e.target.onerror = null; e.target.src = assets.menu_1; }} />
            </div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
