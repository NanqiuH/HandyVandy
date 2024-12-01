export const getLocationName = async (lat, lng) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error(data.error_message || "Failed to get location name");
    }
  };