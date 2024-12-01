import { handleMapClick } from './mapHandlers';
import { getLocationName } from './locationUtils';

// src/components/maps/mapHandlers.test.js

jest.mock('./locationUtils');

describe('handleMapClick', () => {
    let setShowDialog, setDialogLocation, setSelectedLocation, mapProps, user;

    beforeEach(() => {
        setShowDialog = jest.fn();
        setDialogLocation = jest.fn();
        setSelectedLocation = jest.fn();
        mapProps = {
            detail: {
                placeId: 'somePlaceId',
                latLng: {
                    lat: 10,
                    lng: 20
                }
            }
        };
        user = { uid: 'user123' };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle map click and set location when user is defined', async () => {
        getLocationName.mockResolvedValue('Test Location');

        await handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user);

        expect(getLocationName).toHaveBeenCalledWith(10, 20);
        expect(setShowDialog).toHaveBeenCalledWith(true);
        expect(setDialogLocation).toHaveBeenCalledWith({ lat: 10, lng: 20 });
        expect(setSelectedLocation).toHaveBeenCalledWith({
            lat: 10,
            lng: 20,
            name: 'Test Location',
            userId: 'user123'
        });
    });

    test('should handle error when getLocationName fails', async () => {
        getLocationName.mockRejectedValue(new Error('Failed to fetch location'));

        await handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user);

        expect(getLocationName).toHaveBeenCalledWith(10, 20);
        expect(setShowDialog).not.toHaveBeenCalled();
        expect(setDialogLocation).not.toHaveBeenCalled();
        expect(setSelectedLocation).not.toHaveBeenCalled();
    });

    test('should not proceed if placeId is not present', async () => {
        mapProps.detail.placeId = null;

        await handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user);

        expect(getLocationName).not.toHaveBeenCalled();
        expect(setShowDialog).not.toHaveBeenCalled();
        expect(setDialogLocation).not.toHaveBeenCalled();
        expect(setSelectedLocation).not.toHaveBeenCalled();
    });

    test('should alert if user is not defined', async () => {
        user = null;
        window.alert = jest.fn();

        getLocationName.mockResolvedValue('Test Location');

        await handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user);

        expect(window.alert).toHaveBeenCalledWith("User information is not available. Please log in.");
        expect(setShowDialog).toHaveBeenCalledWith(true);
        expect(setDialogLocation).toHaveBeenCalledWith({ lat: 10, lng: 20 });
        expect(setSelectedLocation).not.toHaveBeenCalled();
    });

    test('should alert if user.uid is not available', async () => {
        user = { uid: null };
        window.alert = jest.fn();

        getLocationName.mockResolvedValue('Test Location');

        await handleMapClick(mapProps, setShowDialog, setDialogLocation, setSelectedLocation, user);

        expect(window.alert).toHaveBeenCalledWith("User information is not available. Please log in.");
        expect(setShowDialog).toHaveBeenCalledWith(true);
        expect(setDialogLocation).toHaveBeenCalledWith({ lat: 10, lng: 20 });
        expect(setSelectedLocation).not.toHaveBeenCalled();
    });
});