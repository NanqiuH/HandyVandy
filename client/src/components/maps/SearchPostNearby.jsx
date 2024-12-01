import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import styles from "./SearchPostNearby.module.css";
import Button from "@mui/material/Button";
import Header from "../Layout/Header";
import userMarker from "../../images/userMarkerIcon.png";
import { getLocationName } from "./locationUtils";
import { fetchLocations } from "./fetchLocations";
import { handleMapClick } from "./mapHandlers";
import { saveLocation } from "./saveLocations";
import { handleDeleteLocation } from "./handleDeleteLocation";

const SearchPostNearby = () => {
  const [markerLocation, setMarkerLocation] = useState({
    lat: 36.1420163,
    lng: -86.8038583,
  });
  const [selectedLocation, setSelectedLocation] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLocation, setDialogLocation] = useState({});
  const [listOfLocations, setListOfLocations] = useState([]);
  const [userMarkerIcon, setUserMarkerIcon] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(auth.currentUser);
    (async () => {
      const locations = await fetchLocations();
      setListOfLocations(locations);
    })();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMarkerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  // const handleMapClick = async (mapProps) => {
  //   if (mapProps.detail.placeId) {
  //     const lat = mapProps.detail.latLng.lat;
  //     const lng = mapProps.detail.latLng.lng;
  //     try {
  //       const locationName = await getLocationName(lat, lng);
  //       setShowDialog(true);
  //       setDialogLocation({ lat, lng });
  //       if (user && user.uid) {
  //         setSelectedLocation({
  //           lat,
  //           lng,
  //           name: locationName,
  //           userId: user.uid,
  //         });
  //       } else {
  //         console.error("User is not defined or user.uid is not available");
  //         alert("User information is not available. Please log in.");
  //       }
  //     } catch (error) {
  //       console.error("Error getting location name:", error);
  //       alert("Failed to get location name. Please try again.");
  //     }
  //   } else {
  //     alert("Please select the specific location");
  //   }
  // };

  const saveLocations = async () => {
    await saveLocation(selectedLocation, setListOfLocations, setShowDialog);
  };

  const onDeleteLocation = async (loc) => {
    await handleDeleteLocation(loc, user, setListOfLocations);
  };

  const onViewLocation = (loc) => {
    setMarkerLocation({ lat: loc.lat, lng: loc.lng });
  };

  return (
    <>
      <Header />
      <div className={styles.app}>
        <div className={styles.mapContainer}>
          <APIProvider
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onLoad={() => {
              console.log("Maps API has loaded.");
              setUserMarkerIcon({
                url: userMarker,
                scaledSize: new window.google.maps.Size(50, 50),
              });
            }}
          >
            <Map
              style={{ borderRadius: "20px" }}
              defaultZoom={15}
              defaultCenter={markerLocation}
              gestureHandling={"greedy"}
              disableDefaultUI
              onClick={(mapProps) => handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user)}
            >
              {listOfLocations.map((loc) => (
                  <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                />
          
              ))}
              {showDialog && (
                <InfoWindow data-testid="info-window" position={dialogLocation}>
                  <div>
                    <p>Do you want to save this location?</p>
                    <Button onClick={saveLocations}>Save</Button>
                    <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                  </div>
                </InfoWindow>
              )}
              <Marker
                position={markerLocation}
                icon={userMarkerIcon}
              />
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
                      <Button
                        className={styles.viewButton}
                        onClick={() => onViewLocation(loc)}
                      >
                        View
                      </Button>
                      {loc.userId === user?.uid && (
                        <Button
                          className={styles.deleteButton}
                          onClick={() => onDeleteLocation(loc)}
                        >
                          Delete
                        </Button>
                      )}
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