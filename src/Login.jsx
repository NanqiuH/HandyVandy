import React from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@mui/material';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User created successfully');
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <form>
        <h2>Login</h2>
        <label htmlFor='email'>
            Email:
            <input type='email' onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label htmlFor='password'>
            Password:
            <input type='password' onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <Button onClick={handleSubmit}>Log in</Button>
        <p>Don't have an account? <Button href='/signup'>Register</Button></p>
    </form>
  );
}

export default Login;