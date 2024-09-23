import React from 'react';
import { Button } from '@mui/material';

const Home = () => {
  return (
    <>
      <h1>This is the Home Page</h1>
      <Button variant='contained' color='primary' href='/signup'>Sign Up</Button>
      <Button variant='contained' color='primary' href='/login'>Login</Button>
      <Button variant='contained' color='primary' href='/create-profile'>Create Profile</Button>
      <Button variant='contained' color='primary' href='/profile-list'>Profile List</Button>
    </>
  );
};

export default Home;