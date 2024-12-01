import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import styles from './Header.module.css';
import { Button } from '@mui/material'; 
import HandyVandyLogo from '../../images/UI/HandyVandyLogo.png';
import HandyVandyLogoText from '../../images/HandyVandyHeaderText.png';
import createPost from '../../images/UI/CreatePost.png';
import message from '../../images/UI/message.png';
import usericon from '../../images/UI/user.png';
import location from '../../images/UI/location.png';
import category from '../../images/UI/category.png';

const Header = () => {
  const navigate = useNavigate(); 
  const { user, profileImage, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Button className={styles.logoButton} onClick={() => navigate('/posting-list')}>
        <img src={HandyVandyLogo} alt="HandyVandy Logo" className={styles.logoImage} />
        <img src={HandyVandyLogoText} alt="HandyVandy Logo" className={styles.logoImage} />
      </Button>
      {user ? (
        <nav className={styles.nav}>
          <Button variant="contained" color="inherit" onClick={() => navigate('/search-post-nearby')}><img alt="location" src={location}></img></Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/chat/:id')}><img alt="chat" src={message}></img></Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/posting-list')}><img alt="category" src={category}></img></Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/create-posting')}><img alt="createPost" src={createPost}></img></Button>
          <Button variant="contained" color="inherit" onClick={() => navigate('/profile-list')}><img alt="usericon" src={usericon}></img></Button>
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