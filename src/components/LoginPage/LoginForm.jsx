import React from "react";
import styles from "./LoginForm.module.css";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('Login successfully');
          navigate('/posting-list');
      } catch (error) {
          console.error(error);
          alert('Login failed. Please check your email and password.');
      }
  }

  return (
    <form className={styles.loginForm}>
            <div className={styles.inputGroup}>
        <MailIcon />
        <input
          className={styles.inputField}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <KeyIcon />
        <input
          className={styles.inputField}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
      <div className={styles.formOptions}>
        <label className={styles.rememberMe}>
          <input type="checkbox" className={styles.checkbox} />
          <span>Remember me</span>
        </label>
        <a href="#" className={styles.forgotPassword}>
          Forgot Password?
        </a>
      </div>
      <button type="submit" className={styles.loginButton} onClick={handleSubmit}>
        Login
      </button>
      <p className={styles.registerPrompt}>
        Don't have an account?{" "}
        <a href="signup" className={styles.registerLink}>
          Register
        </a>
      </p>
    </form>
  );
}

export default LoginForm;
