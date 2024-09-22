import React from "react";
import styles from "./SignUpForm.module.css";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';


function SignUpForm() {
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
    <form className={styles.signUpForm}>
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
        <button
          type="button"
          className={styles.showPasswordButton}
          aria-label="Show password"
        >
        </button>
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
      <button type="submit" className={styles.signUpButton} onClick={handleSubmit}>
        SignUp
      </button>
      <p className={styles.registerPrompt}>
        Already have an account?{" "}
        <a href="login" className={styles.registerLink}>
          Login
        </a>
      </p>
    </form>
  );
}

export default SignUpForm;
