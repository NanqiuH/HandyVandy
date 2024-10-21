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
    sortBy: 'none',
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
    const matchesPrice = filters.price ? posting.price <= filters.price : true;
    const matchesServiceType = filters.serviceType ? posting.serviceType === filters.serviceType : true;
    const matchesCategory = filters.category !== 'none' ? posting.category === filters.category : true;
    const matchesSearchTerm = posting.postingName.toLowerCase().includes(searchTerm.toLowerCase()); // Search match
    return matchesPrice && matchesServiceType && matchesCategory && matchesSearchTerm;
  });

  const sortedPostings = [...filteredPostings].sort((a, b) => {
    if (filters.sortBy === 'price') {
      return a.price - b.price; 
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
        {/* <h1 className={styles.title}>Postings</h1> */}
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
                  <option value="physical labor">Physical Labor</option>
                  <option value="tutoring">Tutoring</option>
                  <option value="food">Food</option>
                  <option value="performance">Performance</option>
                  <option value="travel">Travel</option>
                  <option value="technology">Technology</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="transportation">Transportation</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="childcare">Childcare</option>
                  <option value="home improvement">Home Improvement</option>
                  <option value="pet care">Pet Care</option>
                  <option value="event planning">Event Planning</option>
                  <option value="education">Education</option>
                  <option value="art and design">Art & Design</option>
                  <option value="fitness">Fitness</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="writing">Writing</option>
                  <option value="music">Music</option>
                  <option value="photography">Photography</option>
                  <option value="automotive">Automotive</option>
                  <option value="legal">Legal</option>
                  <option value="other">Other</option>
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
                  <option value="price">Price</option>
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
