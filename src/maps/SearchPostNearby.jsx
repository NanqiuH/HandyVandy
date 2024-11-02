import React, { useEffect, useState } from 'react';
import {APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import styles from './SearchPostNearby.module.css';
import Button from '@mui/material/Button';

const SearchPostNearby = () => {
  const [markerLocation, setMarkerLocation] = useState({
    lat: 36.1420163, 
    lng: -86.8038583
  });
  // store clicked location
  const [selectedLocation, setSelectedLocation] = useState({});
  // store show dialog state to add location
  const [showDialog, setShowDialog] = useState(false);
  // store dialog location
  const [dialogLocation, setDialogLocation] = useState("");
  const [listOfLocations, setListOfLocations] = useState([]);

  // handle click on map
  const handleMapClick = (mapProps) => {
    // checks if location clicked is valid
    if (mapProps.detail.placeId) {
      const lat = mapProps.detail.latLng.lat;
      const lng = mapProps.detail.latLng.lng;
      setShowDialog(true);
      setDialogLocation({ lat, lng });
      setSelectedLocation({ lat, lng });
    } else {
      // show alert message
      alert("Please select the specific location");
    }
  };

  // add location to show in a list
  const onAddLocation = () => {
    // Create a Google Maps Geocoder instance
    const geocoder = new window.google.maps.Geocoder();

    // Reverse geocode the coordinates to get the place name
    geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setListOfLocations([
            ...listOfLocations,
            { name: results[0].formatted_address, location: selectedLocation },
          ]);
          setShowDialog(false);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  // displays marker on the map for the selected location
  const onViewLocation = (loc) => {
    setMarkerLocation({ lat: loc.lat, lng: loc.lng });
  };

  // deletes selected location from the list
  const onDeleteLocation = (loc) => {
    let updatedList = listOfLocations.filter(
      (l) => loc.lat !== l.location.lat && loc.lng !== l.location.lng
    );
    setListOfLocations(updatedList);
  };


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

  return (
    <>
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
            // displays a dialog to add clicked location
            <InfoWindow position={dialogLocation}>
              <button className={styles.appButton} onClick={onAddLocation}>
                Add this location
              </button>
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
              <div key={loc.location.lat + loc.location.lng} className={styles.listItem}>
                <div className={styles.card}>
                  <p className={styles.latLngText}>{loc.name}</p>
                  <div className={styles.buttonContainer}>
                    <Button className={styles.viewButton} handleClick={() => onViewLocation(loc.location)}>View</Button>
                    <Button className={styles.deleteButton} handleClick={() => onDeleteLocation(loc.location)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className={styles.noLocationMessage}>
              Select a location from map to show in a list
            </p>
          </div>
        )}
      </div>
    </div>


      
    </>
  );
}

export default SearchPostNearby;