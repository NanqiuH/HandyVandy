import React from "react";
import styles from "./SocialSignUp.module.css";

function SocialSignUp() {
  return (
    <button className={styles.socialLoginButton}>
      <img
        src="google.png"
        alt=""
        className={styles.googleIcon}
      />
      <span className={styles.socialLoginText}>SignUp with Google</span>
    </button>
  );
}

export default SocialSignUp;
