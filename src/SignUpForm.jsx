import React from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@mui/material';

const SignUpForm = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully');
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <form>
        <h2>Sign Up</h2>
        <label htmlFor='email'>
            Email:
            <input type='email' onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label htmlFor='password'>
            Password:
            <input type='password' onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <Button onClick={handleSubmit}>Sign Up</Button>
        <p>Already Registered? <Button href='/login'>Login</Button></p>
    </form>
  );
}

export default SignUpForm;