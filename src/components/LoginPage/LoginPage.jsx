import React from "react";
import styles from "./LoginPage.module.css";
import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";
import Layout from "../Layout/Layout";

function LoginPage() {
  return (
    <Layout>  
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
              <SocialLogin />
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
    </Layout>
  );
}

export default LoginPage;
