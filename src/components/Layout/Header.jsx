import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { Button } from '@mui/material'; 
import HandyVandyLogo from './HandyVandyLogoNoBkgd.png';

const Header = () => {
  const navigate = useNavigate(); 

  return (
    <header className={styles.header}>
      <Button className={styles.logoButton} onClick={() => navigate('/')}>
        <img src={HandyVandyLogo} alt="HandyVandy Logo" className={styles.logoImage} />
      </Button>
      <nav className={styles.nav}>
        <Button variant="contained" color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
        <Button variant="contained" color="inherit" onClick={() => navigate('/login')}>Login</Button>
        <Button variant="contained" color="inherit" onClick={() => navigate('/create-profile')}>Create Profile</Button>
        <Button variant="contained" color="inherit" onClick={() => navigate('/profile-list')}>Profile List</Button>
      </nav>
    </header>
  );
};

export default Header;
