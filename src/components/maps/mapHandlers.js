import { getLocationName } from './locationUtils';

export const handleMapClick = async (mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user) => {
    if (mapProps.detail.placeId) {
        const lat = mapProps.detail.latLng.lat;
        const lng = mapProps.detail.latLng.lng;
        try {
            const locationName = await getLocationName(lat, lng);
            setShowDialog(true);
            setDialogLocation({ lat, lng });
            if (user && user.uid) {
                setSelectedLocation({
                    lat,
                    lng,
                    name: locationName,
                    userId: user.uid,
                });
            } else {
                console.error("User is not defined or user.uid is not available");
                alert("User information is not available. Please log in.");
            }
        } catch (error) {
            console.error("Error getting location name:", error);
            alert("Failed to get location name. Please try again.");
        }
    }
};