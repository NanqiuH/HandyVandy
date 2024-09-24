import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import HandyVandyLogo from './HandyVandyLogoNoBkgd.png';

const Header = () => {
  const navigate = useNavigate(); 

  return (
    <header className={styles.header}>
      <button className={styles.logoButton} onClick={() => navigate('/')}>
        <img src={HandyVandyLogo} alt="HandyVandy Logo" className={styles.logoImage} />
      </button>
      <nav className={styles.nav}>
        <button variant="contained" color="inherit" onClick={() => navigate('/signup')}>Sign Up</button>
        <button variant="contained" color="inherit" onClick={() => navigate('/login')}>Login</button>
        <button variant="contained" color="inherit" onClick={() => navigate('/create-profile')}>Create Profile</button>
        <button variant="contained" color="inherit" onClick={() => navigate('/profile-list')}>Profile List</button>
      </nav>
    </header>
  );
};

export default Header;
