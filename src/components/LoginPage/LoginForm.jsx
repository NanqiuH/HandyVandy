import React from "react";
import styles from "./LoginForm.module.css";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('Login successfully');
          navigate('/');
      } catch (error) {
          console.error(error);
          alert('Login failed. Please check your email and password.');
      }
  }

  return (
    <form className={styles.loginForm}>
      <div className={styles.inputGroup}>
        <MailIcon
          className={styles.inputIcon}
        />
        <div>
          <label htmlFor="email" className={styles.inputLabel}>
            Email
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className={styles.inputField}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <KeyIcon
          className={styles.inputIcon}
        />
        <div>
          <label htmlFor="password" className={styles.inputLabel}>
            Password
            <input
              type="password"
              id="password"
              placeholder="***********"
              className={styles.inputField}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
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
