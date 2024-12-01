import React from "react";
import styles from "./SocialLogin.module.css";

function SocialLogin() {
  return (
    <button className={styles.socialLoginButton}>
      <img
        src="google.png"
        alt=""
        className={styles.googleIcon}
      />
      <span className={styles.socialLoginText}>Login with Google</span>
    </button>
  );
}

export default SocialLogin;
