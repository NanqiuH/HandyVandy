import React from "react";
import styles from "./LoginForm.module.css";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('Login successfully');
      } catch (error) {
          console.error(error);
      }
  }

  return (
    <form className={styles.loginForm}>
      <div className={styles.inputGroup}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f65d88181ae42d16aa43a5531f407ea156f2892534f6416f224206a5af6657d?placeholderIfAbsent=true&apiKey=ab96c5d4fce1429daf3cb89ddde9b564"
          alt=""
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
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e17105234a61a5e65b38643d6839ec49f79a18ba8c0f4faaf9b26ffff9a82da7?placeholderIfAbsent=true&apiKey=ab96c5d4fce1429daf3cb89ddde9b564"
          alt=""
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
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ecae4e524ae80f29be7102f00507dfba80562e9ff064196045453288345870a6?placeholderIfAbsent=true&apiKey=ab96c5d4fce1429daf3cb89ddde9b564"
            alt=""
            className={styles.showPasswordIcon}
          />
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
