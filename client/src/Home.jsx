import React from 'react';
import tower from './images/vandy_tower.png';
import logo from './images/handy_vandy_text.png';
import LoginForm from "./components/LoginPage/LoginForm";
import './Home.css';

const Home = () => {
  return (
    <div className="background">
      <div className="left-login">
        <img src={logo} alt="Handy Vandy logo" />
        <div className="login-form">
          <LoginForm />
        </div>
      </div>
      <div className="right-login">
        <img src={tower} alt="Vanderbilt Zeppos Tower" />
      </div>
    </div>
  );
};

export default Home;
