import React from "react";
import styles from "./SignUpPage.module.css";
import SignUpForm from "./SignUpForm";
import SocialSignUp from "./SocialSignUp";

function SignUpPage() {
  return (
    <main className={styles.signUpPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.imageSection}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/11df6178d800c59a94f8ef7690653a529164ac2a61395df29f7042987e31e588?placeholderIfAbsent=true&apiKey=ab96c5d4fce1429daf3cb89ddde9b564"
              alt="HandyVandy illustration"
              className={styles.heroImage}
            />
          </section>
          <section className={styles.formSection}>
            <div className={styles.formContainer}>
              <header className={styles.welcomeHeader}>
                <h1 className={styles.welcomeTitle}>
                  <span className={styles.welcomeText}>Welcome to</span>
                  <br />
                  <span className={styles.brandName}>HandyVandy</span>
                </h1>
              </header>
              <SocialSignUp />
              <div className={styles.divider}>
                <hr className={styles.dividerLine} />
                <span className={styles.dividerText}>OR</span>
                <hr className={styles.dividerLine} />
              </div>
              <SignUpForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;
