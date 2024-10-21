import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../firebase"; 
import Header from "../Layout/Header"; 
import styles from "./ViewPostingsPage.module.css"; 
import HandyVandyLogo from "../../images/HandyVandyV.png";

function ViewPostingsPage() {
  const [postings, setPostings] = useState([]);
  const [filters, setFilters] = useState({
    price: '',
    serviceType: '',
    category: 'none',
    sortBy: 'date',
  });
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const postingsCollection = collection(db, "postings");
        const postingsSnapshot = await getDocs(postingsCollection);
        const postingsList = postingsSnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setPostings(postingsList);
      } catch (error) {
        console.error("Error fetching postings: ", error);
      }
    };

    fetchPostings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPostings = postings.filter((posting) => {
    const matchesPrice = filters.price ? parseFloat(posting.price) <= parseFloat(filters.price) : true;
    const matchesServiceType = filters.serviceType ? posting.serviceType === filters.serviceType : true;
    const matchesCategory = filters.category !== 'none' ? posting.category === filters.category : true;
    const matchesSearchTerm = posting.postingName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPrice && matchesServiceType && matchesCategory && matchesSearchTerm;
  });

  const sortedPostings = [...filteredPostings].sort((a, b) => {
    if (filters.sortBy === 'price-low-high') {
      return parseFloat(a.price) - parseFloat(b.price); 
    } else if (filters.sortBy === 'price-high-low') {
      return parseFloat(b.price) - parseFloat(a.price);
    } else if (filters.sortBy === 'alphabetical') {
      return a.postingName.localeCompare(b.postingName);
    } else if (filters.sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <div>
      <Header />
      <main className={styles.postingsPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <input
              type="text"
              className={styles.searchBar}
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={styles.filters}>
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                />
              </label>
              <label>
                Service Type:
                <select
                  name="serviceType"
                  value={filters.serviceType}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="offering">Offering</option>
                  <option value="requesting">Requesting</option>
                </select>
              </label>
              <label>
                Category:
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="none">All</option>
                </select>
              </label>
              <label>
                Sort By:
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="date">Upload Date</option>
                  <option value="price-low-high">Price (low to high)</option>
                  <option value="price-high-low">Price (high to low)</option>
                  <option value="alphabetical">Alphabetically</option>
                </select>
              </label>
            </div>
          </header>
          <div className={styles.postingsList}>
            {sortedPostings.length === 0 ? (
              <p>No postings available.</p>
            ) : (
              sortedPostings.map((posting) => {
                const postingImageUrl = posting.postingImageUrl || HandyVandyLogo;
                console.log(postingImageUrl);
                return (
                  <Link
                    to={`/posting/${posting.id}`} 
                    key={posting.id} 
                    className={styles.postingLink}
                  >
                    <div className={styles.postingCard}>
                      <img
                        src={postingImageUrl}
                        alt={posting.postingName}
                        className={styles.postingImage}
                      />
                      <div className={styles.postingCardContent}>
                        <h2 className={styles.postingName}>{posting.postingName}</h2>
                        <p className={styles.postingDescription}>
                          {posting.description}
                        </p>
                        <p className={styles.postingPrice}>Price: ${posting.price}</p>
                        <p className={styles.postingType}>
                          {posting.serviceType === "offering"
                            ? "Offering"
                            : "Requesting"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewPostingsPage;
