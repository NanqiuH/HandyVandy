import React from "react";
import styles from "./SignUpPage.module.css";
import SignUpForm from "./SignUpForm";
import SocialSignUp from "./SocialSignUp";
import Header from "../Layout/Header";
import Home from "../../Home";

function SignUpPage() {
  return (
    <Home>
      <div>
    <Header />
    <main className={styles.signUpPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.imageSection}>
            <img
              src="loginHero.png"
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
    </div>
    </Home>
  );
}

export default SignUpPage;
