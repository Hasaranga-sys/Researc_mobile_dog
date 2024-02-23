// firebaseFunctions.js
import { storage } from '../firebase/firebase-config'; // Import your Firebase storage instance

export const uploadImage = async (uri) => {
    console.log("start uploading.");
    console.log(uri);
  const response = await fetch(uri);
  console.log(response);
  const blob = await response.blob();
  console.log(blob);
  const storageRef = storage.ref().child(`images/${new Date().toISOString()}`);
  console.log(storageRef);
  await storageRef.put(blob);

  return storageRef.getDownloadURL();
};

import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance

export const storeDataInFirestore = (imageUrl, textInput) => {
  const collectionRef = db.collection('set_of_img'); // Replace with your Firestore collection name

  // Add a new document with the image URL and text input
  collectionRef.add({
    imageUrl: imageUrl,
    textInput: textInput,
    timestamp: new Date(),
  });
};