import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // Firebase Firestore functions to get documents
import { db } from "../../firebase"; // Import Firebase configuration
import Header from "../Layout/Header"; // Import Header component
import styles from "./ViewPostingsPage.module.css"; // Import custom CSS
import HandyVandyLogo from "../../images/HandyVandyV.png"; // Fallback logo if posting has no image

function ViewPostingsPage() {
  const [postings, setPostings] = useState([]); // State to store postings data fetched from Firestore
  const [filters, setFilters] = useState({
    price: '', // Filter by price (maximum price)
    serviceType: '', // Filter by service type (offering/requesting)
    category: 'none', // Filter by category (default to "none", meaning no specific category)
    sortBy: 'date', // Sort postings (default: by date)
  });
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term to filter postings by title

  // Fetch postings from Firestore when the component is mounted
  useEffect(() => {
    const fetchPostings = async () => {
      try {
        const postingsCollection = collection(db, "postings"); // Reference to the 'postings' collection
        const postingsSnapshot = await getDocs(postingsCollection); // Fetch all documents from the collection
        const postingsList = postingsSnapshot.docs.map((doc) => ({
          id: doc.id, // Store the document ID
          ...doc.data(), // Spread the document data
        }));
        setPostings(postingsList); // Set the fetched postings in the state
      } catch (error) {
        console.error("Error fetching postings: ", error); // Log any errors
      }
    };

    fetchPostings(); // Call the function to fetch postings
  }, []);

  // Handle changes in filters (price, service type, category, and sort order)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value, // Update the respective filter value
    }));
  };

  // Handle changes in the search term input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  // Filter postings based on the selected filters and search term
  const filteredPostings = postings.filter((posting) => {
    const matchesPrice = filters.price ? parseFloat(posting.price) <= parseFloat(filters.price) : true; // Filter by price
    const matchesServiceType = filters.serviceType ? posting.serviceType === filters.serviceType : true; // Filter by service type
    const matchesCategory = filters.category !== 'none' ? posting.category === filters.category : true; // Filter by category
    const matchesSearchTerm = posting.postingName.toLowerCase().includes(searchTerm.toLowerCase()); // Filter by search term
    return matchesPrice && matchesServiceType && matchesCategory && matchesSearchTerm; // Return postings that match all conditions
  });

  // Sort postings based on the selected sort option (price, alphabetical, or date)
  const sortedPostings = [...filteredPostings].sort((a, b) => {
    if (filters.sortBy === 'price-low-high') {
      return parseFloat(a.price) - parseFloat(b.price); // Sort by price low to high
    } else if (filters.sortBy === 'price-high-low') {
      return parseFloat(b.price) - parseFloat(a.price); // Sort by price high to low
    } else if (filters.sortBy === 'alphabetical') {
      return a.postingName.localeCompare(b.postingName); // Sort alphabetically by posting name
    } else if (filters.sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by date (newest first)
    }
    return 0; // Default sorting (no change)
  });

  return (
    <div>
      <Header /> {/* Display the header component */}
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
          <div className={styles.postingsList}>
            {sortedPostings.length === 0 ? (
              <p>No postings available.</p> // Display message if no postings match the filter/search criteria
            ) : (
              sortedPostings.map((posting) => {
                const postingImageUrl = posting.postingImageUrl || HandyVandyLogo; // Fallback to default logo if no image
                console.log(postingImageUrl);
                return (
                  <Link
                    to={`/posting/${posting.id}`} // Link to individual posting page
                    key={posting.id} // Ensure unique key for each posting
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
                          {posting.serviceType === "offering" ? "Offering" : "Requesting"}
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
