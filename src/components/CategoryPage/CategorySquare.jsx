import React from "react";
import styles from "./CategoryPage.module.css"; 

function CategorySquare({ imgSrc, label, onClick }) {
  return (
    <div className={styles.square}>
      <img src={imgSrc} alt={label} className={styles.image} />
      <h2 className={styles.label}>{label}</h2>
    </div>
  );
}

export default CategorySquare;
