import React, { useContext, useEffect, useRef } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {

  const {food_list, searchQuery} = useContext(StoreContext);
  const highlightRef = useRef(null);

  const filteredList = food_list.filter(item =>
    (category === "All" || category === item.category) &&
    (searchQuery.trim() === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    if (searchQuery.trim() !== "" && highlightRef.current) {
      highlightRef.current.classList.add('highlight-food-item');
      setTimeout(() => {
        if (highlightRef.current) highlightRef.current.classList.remove('highlight-food-item');
      }, 1200);
    }
  }, [searchQuery]);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {filteredList.length === 0 ? (
          <p style={{padding:'2rem',color:'#888'}}>No food found.</p>
        ) : filteredList.map((item, idx) => {
          const refProp = (searchQuery.trim() !== "" && idx === 0) ? { ref: highlightRef } : {};
          return <div key={item._id} {...refProp}><FoodItem image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id}/></div>
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
