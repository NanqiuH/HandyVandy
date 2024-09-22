import React from "react";
import styles from "./SocialLogin.module.css";

function SocialLogin() {
  return (
    <button className={styles.socialLoginButton}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f6a1ece5f9f01e75790848289df6d28369102255f027941851528593addfa084?placeholderIfAbsent=true&apiKey=ab96c5d4fce1429daf3cb89ddde9b564"
        alt=""
        className={styles.googleIcon}
      />
      <span className={styles.socialLoginText}>Login with Google</span>
    </button>
  );
}

export default SocialLogin;
