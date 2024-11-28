import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Layout/Header";
import styles from "./FriendsListPage.module.css";
import anonProfile from "../../images/anon_profile.png";

function FriendsListPage() {
  const { id } = useParams();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userDoc = await getDoc(doc(db, "profiles", id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const friendIds = userData.friends || [];

          const friendDocs = await Promise.all(
            friendIds.map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, "profiles", friendId));
              return friendDoc.exists() ? { id: friendId, ...friendDoc.data() } : null;
            })
          );

          setFriends(friendDocs.filter((friend) => friend !== null));
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <main className={styles.friendsListPage}>
        <div className={styles.container}>
          <h1 className={styles.title}>Friends List</h1>
          {friends.length === 0 ? (
            <p>No friends to display.</p>
          ) : (
            <ul className={styles.friendsList}>
              {friends.map((friend) => (
                <li key={friend.id} className={styles.friendCard}>
                  <Link to={`/profile/${friend.id}`} className={styles.friendLink}>
                    <img
                      src={friend.profileImageUrl || anonProfile}
                      alt={friend.firstName}
                      className={styles.friendImage}
                    />
                    <div className={styles.friendDetails}>
                      <h2>{friend.firstName} {friend.middleName} {friend.lastName}</h2>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default FriendsListPage;
