import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "./LoginForm";
import Header from "../Layout/Header";

// Note: SocialLogin is now deprecated

function LoginPage() {
  return (
    <div>
      <Header />  
      <main className={styles.loginPage}>
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
                <div className={styles.divider}>
                  <hr className={styles.dividerLine} />
                  <span className={styles.dividerText}>OR</span>
                  <hr className={styles.dividerLine} />
                </div>
                <LoginForm />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
