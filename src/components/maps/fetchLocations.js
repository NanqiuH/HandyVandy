import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchLocations = async () => {
    try {
      const locationsCollection = collection(db, "locations");
      console.log("Fetching locations from collection:", locationsCollection);
      const querySnapshot = await getDocs(locationsCollection);
      console.log("Query snapshot:", querySnapshot);
  
      if (!querySnapshot || querySnapshot.empty) {
        console.log("No matching documents.");
        return [];
      } else {
        const locations = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        return locations;
      }
    } catch (error) {
      console.error("Error fetching locations: ", error);
      return [];
    }
  };