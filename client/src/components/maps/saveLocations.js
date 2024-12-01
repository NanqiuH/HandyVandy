import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchLocations } from "./fetchLocations";

export const saveLocation = async (selectedLocation, setListOfLocations, setShowDialog) => {
  try {
    await addDoc(collection(db, "locations"), selectedLocation);
    const locations = await fetchLocations();
    setListOfLocations(locations);
    setShowDialog(false); // Close the dialog after saving
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};