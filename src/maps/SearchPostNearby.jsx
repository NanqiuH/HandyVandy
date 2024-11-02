import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from '../firebase'; 
import { onAuthStateChanged } from "firebase/auth";
import styles from './SearchPostNearby.module.css';
import Button from '@mui/material/Button';
import Header from '../components/Layout/Header';

const SearchPostNearby = () => {
  const [markerLocation, setMarkerLocation] = useState({
    lat: 36.1420163, 
    lng: -86.8038583
  });
  const [selectedLocation, setSelectedLocation] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLocation, setDialogLocation] = useState({});
  const [listOfLocations, setListOfLocations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    fetchLocations();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMarkerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  const handleMapClick = async (mapProps) => {
    if (mapProps.detail.placeId) {
      const lat = mapProps.detail.latLng.lat;
      const lng = mapProps.detail.latLng.lng;
      try {
        const locationName = await getLocationName(lat, lng);
        setShowDialog(true);
        setDialogLocation({ lat, lng });
        setSelectedLocation({ lat, lng, name: locationName, userId: user.uid });
      } catch (error) {
        console.error("Error getting location name:", error);
        alert("Failed to get location name. Please try again.");
      }
    } else {
      alert("Please select the specific location");
    }
  };

  const getLocationName = async (lat, lng) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error(data.error_message || "Failed to get location name");
    }
  };

  const saveLocation = async () => {
    try {
      await addDoc(collection(db, "locations"), selectedLocation);
      fetchLocations();
      setShowDialog(false); // Close the dialog after saving
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchLocations = async () => {
    const querySnapshot = await getDocs(collection(db, "locations"));
    const locations = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setListOfLocations(locations);
  };

  const onDeleteLocation = async (loc) => {
    if (loc.userId === user.uid) {
      try {
        await deleteDoc(doc(db, "locations", loc.id));
        fetchLocations();
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    } else {
      alert("You do not have permission to delete this location.");
    }
  };

  const onViewLocation = (loc) => {
    setMarkerLocation({ lat: loc.lat, lng: loc.lng });
  };

  return (
    <>
      <Header />
      <div className={styles.app}>
      <div className={styles.mapContainer}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
          <Map
            style={{ borderRadius: "20px" }}
            defaultZoom={13}
            defaultCenter={markerLocation}
            gestureHandling={"greedy"}
            disableDefaultUI
            onClick={(mapProps) => handleMapClick(mapProps)}
          >
            {showDialog && (
              <InfoWindow position={dialogLocation}>
                <div>
                  <p>Do you want to save this location?</p>
                  <Button onClick={saveLocation}>Save</Button>
                  <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                </div>
              </InfoWindow>
            )}
            <Marker position={markerLocation} />
          </Map>
        </APIProvider>
      </div>

      <div className={styles.listContainer}>
        {listOfLocations.length > 0 ? (
          <div>
            <p className={styles.listHeading}>List of Selected Locations</p>
            {listOfLocations.map((loc) => (
              <div key={loc.id} className={styles.listItem}>
                <div className={styles.card}>
                  <p className={styles.latLngText}>{loc.name}</p>
                  <div className={styles.buttonContainer}>
                    <Button className={styles.viewButton} onClick={() => onViewLocation(loc)}>View</Button>
                    <Button className={styles.deleteButton} onClick={() => onDeleteLocation(loc)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className={styles.listHeading}>
              Select a location from map to show in a list
            </p>
          </div>
        )}
      </div>
    </div>
    </>

  );
};

export default SearchPostNearby;