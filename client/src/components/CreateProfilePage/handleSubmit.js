import { auth, storage, db } from '../../firebase'; // Adjust the import paths as necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const handleSubmit = async (e, formData, navigate) => {
  e.preventDefault();
  try {
    const user = auth.currentUser;

    if (!user || !user.uid) {
      throw new Error("User not authenticated");
    }

    let profileImageUrl = null;
    if (formData.profileImage) {
      const storageRef = ref(storage, `profileImages/${formData.profileImage.name}`);
      await uploadBytes(storageRef, formData.profileImage);
      profileImageUrl = await getDownloadURL(storageRef);
    }

    const profileDocRef = doc(db, "profiles", user.uid);

    await setDoc(profileDocRef, {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      bio: formData.bio,
      cardNumber: formData.cardNumber,
      profileImageUrl: profileImageUrl,
      rating: formData.rating,
      numRatings: formData.numRatings,
    });
    navigate("/posting-list");

  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export default handleSubmit;