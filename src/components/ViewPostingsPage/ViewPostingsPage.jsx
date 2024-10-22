import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; 
import { db } from "../../firebase"; 
import Header from "../Layout/Header"; // Header component for page layout
import styles from "./ViewPostingsPage.module.css"; // Custom CSS styles
import HandyVandyLogo from "../../images/HandyVandyV.png"; // Default logo in case a posting has no image

function ViewPostingsPage() {
  // State to store all postings fetched from Firestore
  const [postings, setPostings] = useState([]);

  // State to manage filter values (price, service type, category, sorting)
  const [filters, setFilters] = useState({
    price: '', // Filter by maximum price
    serviceType: '', // Filter by service type (offering/requesting)
    category: 'none', // Default category filter
    sortBy: 'date', // Default sorting by upload date
  });
  // State to manage search term for searching postings by title
  const [searchTerm, setSearchTerm] = useState(""); 

  // Fetch postings from Firestore when the component is mounted
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

   // Handle changes to filter inputs (e.g., price, service type, category, sorting)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle search input changes to filter postings by title
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter postings based on price, service type, category, and search term
  const filteredPostings = postings.filter((posting) => {
    const matchesPrice = filters.price ? parseFloat(posting.price) <= parseFloat(filters.price) : true;
    const matchesServiceType = filters.serviceType ? posting.serviceType === filters.serviceType : true;
    const matchesCategory = filters.category !== 'none' ? posting.category === filters.category : true;
    const matchesSearchTerm = posting.postingName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPrice && matchesServiceType && matchesCategory && matchesSearchTerm;
  });

  // Sort the filtered postings based on the selected sorting method
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
            {/* Search bar for searching postings by title */}
            <input
              type="text"
              className={styles.searchBar}
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={styles.filters}>
              {/* Price filter input */}
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
              {/* Service Type filter dropdown */}
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
              {/* Category filter dropdown */}
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
                  <option value="other">Other</option>
                </select>
              </label>
              {/* Sort By filter dropdown */}
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
          {/* Display list of postings */}
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
                      {/* Display posting image */}
                      <img
                        src={postingImageUrl}
                        alt={posting.postingName}
                        className={styles.postingImage}
                      />
                      {/* Display posting details */}
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
