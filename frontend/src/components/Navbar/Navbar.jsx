import React, { useContext, useEffect, useState, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token ,setToken, searchQuery, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();
  const searchInputRef = useRef();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      const foodSection = document.getElementById('food-display');
      if (foodSection) {
        foodSection.scrollIntoView({ behavior: 'smooth' });
      }
      setSearchQuery("");
    }
  };

  const handleProfileMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const handleProfileMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 220);
  };
  const handleProfileClick = () => {
    setDropdownOpen((open) => !open);
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
      <div className="navbar-right">
        <button
          style={{marginRight:12,background:'none',border:'none',fontSize:22,cursor:'pointer'}}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setDarkMode(dm => !dm)}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        <form onSubmit={handleSearch} style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchQuery("")}
            style={{padding:'4px 8px',borderRadius:'4px',border:'1px solid #ccc'}}
          />
          <button type="submit" style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>
            <img src={assets.search_icon} alt="" />
          </button>
        </form>
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button className="navbar-signin-btn" onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              tabIndex={0}
              onClick={handleProfileClick}
              style={{cursor:'pointer'}}
            >
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown' style={{
              opacity: dropdownOpen ? 1 : 0,
              pointerEvents: dropdownOpen ? 'auto' : 'none',
              transform: dropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.98)',
              transition: 'opacity 0.22s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1)'
            }}>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
          </div>
        }

      </div>
    </div>
  )
}

export default Navbar
