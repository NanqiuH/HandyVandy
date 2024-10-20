import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router
import styles from "./CategoryPage.module.css";  // Import your CSS module
import Header from "../Layout/Header";
import CategorySquare from "./CategorySquare";  // Import the CategorySquare component
import book from "../../images/book.png";
import cvs from "../../images/cvs.png";
import hammer from "../../images/hammer.png";
import steak from "../../images/steak.png";

function CategoryPage() {
  const navigate = useNavigate();

  const categories = [
    { imgSrc: steak, label: "Steak" },
    { imgSrc: cvs, label: "CVS" },
    { imgSrc: book, label: "Education" },
    { imgSrc: hammer, label: "Hammer" },
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2 className={styles.heading}>What Category Of Posting Are You Looking For...?</h2>
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <CategorySquare
              key={index}
              imgSrc={category.imgSrc}
              label={category.label}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
