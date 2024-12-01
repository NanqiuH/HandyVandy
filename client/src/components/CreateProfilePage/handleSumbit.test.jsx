import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import handleSubmit from './handleSubmit';

jest.mock('../../firebase', () => ({
    auth: { currentUser: { uid: 'test-uid' } },
    storage: {},
    db: {},
}));

jest.mock('firebase/storage', () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    setDoc: jest.fn(),
}));

describe('handleSubmit', () => {
    const navigate = jest.fn();
    const formData = {
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        bio: 'Bio',
        profileImage: { name: 'profile.jpg' },
        rating: 5,
        numRatings: 10,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('throws an error if user is not authenticated', async () => {
        auth.currentUser = null;
        const e = { preventDefault: jest.fn() };

        await handleSubmit(e, formData, navigate);

        expect(console.error).toHaveBeenCalledWith('Error adding document: ', new Error('User not authenticated'));
    });

    it('uploads profile image and sets profile data in Firestore', async () => {
        auth.currentUser = { uid: 'test-uid' };
        const e = { preventDefault: jest.fn() };
        const mockStorageRef = {};
        ref.mockReturnValue(mockStorageRef);
        uploadBytes.mockResolvedValueOnce();
        getDownloadURL.mockResolvedValueOnce('http://mockurl.com/profile.jpg');
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);
        setDoc.mockResolvedValueOnce();

        await handleSubmit(e, formData, navigate);

        expect(ref).toHaveBeenCalledWith(storage, 'profileImages/profile.jpg');
        expect(uploadBytes).toHaveBeenCalledWith(mockStorageRef, formData.profileImage);
        expect(getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
        expect(doc).toHaveBeenCalledWith(db, 'profiles', 'test-uid');
        expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
            firstName: 'John',
            middleName: 'M',
            lastName: 'Doe',
            bio: 'Bio',
            profileImageUrl: 'http://mockurl.com/profile.jpg',
            rating: 5,
            numRatings: 10,
        });
        expect(navigate).toHaveBeenCalledWith('/posting-list');
    });

    it('sets profile data in Firestore without profile image', async () => {
        auth.currentUser = { uid: 'test-uid' };
        const e = { preventDefault: jest.fn() };
        const formDataWithoutImage = { ...formData, profileImage: null };
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);
        setDoc.mockResolvedValueOnce();

        await handleSubmit(e, formDataWithoutImage, navigate);

        expect(ref).not.toHaveBeenCalled();
        expect(uploadBytes).not.toHaveBeenCalled();
        expect(getDownloadURL).not.toHaveBeenCalled();
        expect(doc).toHaveBeenCalledWith(db, 'profiles', 'test-uid');
        expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
            firstName: 'John',
            middleName: 'M',
            lastName: 'Doe',
            bio: 'Bio',
            profileImageUrl: null,
            rating: 5,
            numRatings: 10,
        });
        expect(navigate).toHaveBeenCalledWith('/posting-list');
    });

    it('handles error during Firestore document creation', async () => {
        auth.currentUser = { uid: 'test-uid' };
        const e = { preventDefault: jest.fn() };
        const mockDocRef = {};
        doc.mockReturnValue(mockDocRef);
        setDoc.mockRejectedValueOnce(new Error('Firestore error'));

        await handleSubmit(e, formData, navigate);

        expect(console.error).toHaveBeenCalledWith('Error adding document: ', new Error('Firestore error'));
    });
});