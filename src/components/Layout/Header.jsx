import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import styles from './Header.module.css';
import { Button } from '@mui/material'; 
import HandyVandyLogo from './HandyVandyLogoNoBkgd.png';

const Header = () => {
  const navigate = useNavigate(); 
  const { user, profileImage, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Button className={styles.logoButton} onClick={() => navigate('/')}>
        <img src={HandyVandyLogo} alt="HandyVandy Logo" className={styles.logoImage} />
      </Button>
      {user ? (
        <nav className={styles.nav}>
          <Button variant="contained" color="inherit" onClick={() => navigate('/profile-list')}>Profile List</Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/create-posting')}>Create Posting</Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/posting-list')}>View Postings</Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/search-post-nearby')}>Nearby Service</Button>
          <Button variant="contained" color="inherit" onClick={() => { logout(); navigate('/'); }}>Sign Out</Button>
          <img
            src={profileImage}
            alt="Profile"
            className={styles.profilePic}
            onClick={() => navigate(`/profile/${user.uid}`)}
          />
        </nav>
      ) : (
        <nav className={styles.nav}>
          <Button variant="contained" color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/login')}>Login</Button>
        </nav>
      )}
    </header>
  );
};

export default Header;