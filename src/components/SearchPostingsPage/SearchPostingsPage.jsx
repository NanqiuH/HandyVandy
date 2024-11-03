import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import Fuse from "fuse.js";
import styles from "./SearchPostingsPage.module.css";
import Header from "../Layout/Header";

const PAGE_SIZE = 10;

function SearchPostingsPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [postings, setPostings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("postingName");
  const [serviceType, setServiceType] = useState("all");

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const querySnapshot = await getDocs(collection(db, "postings"));
        const postingsData = [];
        for (const docSnapshot of querySnapshot.docs) {
          const postingData = { id: docSnapshot.id, ...docSnapshot.data() };
          let postingUID = postingData.postingUID;
          const profileDocRef = doc(db, "profiles", postingUID);
          const userProfileDoc = await getDoc(profileDocRef);
          if (userProfileDoc.exists()) {
            const userProfileData = userProfileDoc.data();
            postingData.firstName = userProfileData.firstName;
            postingData.lastName = userProfileData.lastName;
          }
          postingsData.push(postingData);
        }
        setPostings(postingsData);
      } catch (error) {
        console.error("Error fetching postings: ", error);
      }
    };

    fetchPostings();
  }, []);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fuse = new Fuse(postings, {
      keys: ["postingName", "description"],
      threshold: 0.3,
    });
    let result = fuse.search(keyword).map(({ item }) => item);

    // Filter by service type
    if (serviceType !== "all") {
      result = result.filter(posting => posting.serviceType === serviceType);
    }

    const sortedResults = result.sort((a, b) => {
      if (sortCriteria === "price") {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      return a[sortCriteria].localeCompare(b[sortCriteria]);
    });

    setResults(sortedResults);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const getClassName = (type) => {
    switch (type) {
      case 'offering':
        return `${styles.resultItem} ${styles.offering}`;
      case 'requesting':
        return `${styles.resultItem} ${styles.requesting}`;
      case 'all':
        return `${styles.resultItem} ${styles.all}`;
      default:
        return styles.resultItem;
    }
  };

  const paginatedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
    <Header />
      <main className={styles.searchPage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.formSection}>
              <div className={styles.formContainer}>
                <header className={styles.header}>
                  <h1 className={styles.title}>Search Postings</h1>
                </header>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="keyword" className={styles.label}>
                      Keyword
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      name="keyword"
                      value={keyword}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Enter keyword"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="sortCriteria" className={styles.label}>
                      Sort By
                    </label>
                    <select
                      id="sortCriteria"
                      name="sortCriteria"
                      value={sortCriteria}
                      onChange={handleSortChange}
                      className={styles.select}
                    >
                      <option value="postingName">Posting Name</option>
                      <option value="price">Price</option>
                      <option value="description">Description</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="serviceType" className={styles.label}>
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={serviceType}
                      onChange={handleServiceTypeChange}
                      className={styles.select}
                    >
                      <option value="all">All</option>
                      <option value="offering">Offering</option>
                      <option value="requesting">Requesting</option>
                    </select>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Search
                  </button>
                </form>
              </div>
            </section>
            <section className={styles.resultsSection}>
              {paginatedResults.length > 0 ? (
                <ul className={styles.resultsList}>
                  {paginatedResults.map((posting) => (
                    <li key={posting.id} className={getClassName(posting.serviceType)}>
                      <p><strong>Posting Name:</strong> {posting.postingName}</p>
                      <p><strong>Description:</strong> {posting.description}</p>
                      <p><strong>Price:</strong> {posting.price}</p>
                      <p><strong>Posted by:</strong> {posting.firstName} {posting.lastName}</p>
                      {posting.postingImageUrl && (
                        <img
                          src={posting.postingImageUrl}
                          alt={posting.postingName}
                          className={styles.resultImage}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noResults}>No results found</p>
              )}
              {results.length > PAGE_SIZE && (
                <div className={styles.pagination}>
                  <button onClick={handlePrevPage} className={styles.pageButton} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <button onClick={handleNextPage} className={styles.pageButton} disabled={currentPage * PAGE_SIZE >= results.length}>
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SearchPostingsPage;