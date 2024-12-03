import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../Layout/Header";
import styles from "./HistoryPage.module.css";

function HistoryPage() {
  const { id } = useParams(); // User ID
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Query orders where the user is the buyer
        const ordersQuery = query(collection(db, "orders"), where("buyerUID", "==", id));
        const ordersSnapshot = await getDocs(ordersQuery);
        const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Query sales where the user is the seller
        const salesQuery = query(collection(db, "orders"), where("sellerUID", "==", id));
        const salesSnapshot = await getDocs(salesQuery);
        const fetchedSales = salesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders); // Set fetched orders
        setSales(fetchedSales); // Set fetched sales
      } catch (error) {
        console.error("Error fetching history: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <main className={styles.historyPage}>
        <h1>Transaction History</h1>
        <div className={styles.historySection}>
          <h2>Your Past Orders</h2>
          {orders.length === 0 ? (
            <p>No orders made yet.</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  <h3>{order.postingName}</h3>
                  <p>Price: ${order.price}</p>
                  <p>Purchased on: {new Date(order.createdAt).toLocaleString()}</p>
                  <p>Seller Name: {order.sellerName}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.historySection}>
          <h2>Your Past Posts</h2>
          {sales.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <ul>
              {sales.map((sale) => (
                <li key={sale.id}>
                  <h3>{sale.postingName}</h3>
                  <p>Price: ${sale.price}</p>
                  <p>Sold on: {new Date(sale.createdAt).toLocaleString()}</p>
                  <p>Buyer Name: {sale.buyerName ? sale.buyerName : "Anonymous"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;
