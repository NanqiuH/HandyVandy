import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchLocations } from "./fetchLocations";

export const handleDeleteLocation = async (loc, user, setListOfLocations) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this location?"
  );
  if (confirmed) {
    if (loc.userId === user.uid) {
      try {
        await deleteDoc(doc(db, "locations", loc.id));
        const locations = await fetchLocations();
        setListOfLocations(locations);
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    } else {
      alert("You do not have permission to delete this location.");
    }
  }
};