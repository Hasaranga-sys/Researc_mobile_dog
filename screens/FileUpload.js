import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { View,Text,StyleSheet, Alert, SafeAreaView, Touchable,Image,TextInput,Button, TouchableOpacity} from 'react-native'
import * as FileSystem from 'expo-file-system'
import { uploadImage } from './UploadImage';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  getDocs,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { storage } from '../firebase/firebase-config'; // Import your Firebase storage instance
import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance

const FileUpload = () => {

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false)
  //new gp
  const [imageUri, setImageUri] = useState(null);
  const [textInput, setTextInput] = useState('');

  // const pickImage = async ()=>{
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes:ImagePicker.MediaTypeOptions.All,
  //     allowsEditing:true,
  //     aspect:[4,4],
  //     quality:1,
  //   });

  //   if(!result.canceled){
  //     setImage(result.assets[0].uri)
  //   }
  // };

  //upload media files
  
  //new gp
  const pickImage = async () => {
    try {
      const response = await ImagePicker.launchImageLibraryAsync({});
      if (!response.canceled) {
        setImageUri(response.uri);
        console.log("this is mog in pick image", response.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  //new gp
  const uploadData = async () => {
    try {
      console.log("before image uri");
      console.log(imageUri);
      // Upload image and get its download URL
      uploadImage(imageUri);
      // w

      // Now you can store imageUrl and textInput in Firestore or perform any other action
      // Example: storeDataInFirestore(imageUrl, textInput);

      // console.log('Image URL:', imageUrl);
      // console.log('Text Input:', textInput);
      // console.log("start");
      // storeDataInFirestore(imageUrl,textInput)
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };
  //new from ext file pt 2
  const storeDataInFirestore = async (imageUrl, textInput) => {
    console.log("Image uri and text input IN FIRESTORE CALL : ",imageUrl, textInput);

    try {
      const predictionsCollectionRef = collection(db,'Predictions')
      await setDoc(doc(predictionsCollectionRef),{
      imageUrl: imageUrl,
      textInput: textInput,
      timestamp: new Date(),
      })
      console.log("Data stored successfully in Firestore!");
    } catch (error) {
      console.error("Error storing data in Firestore:", error);
    }


  };

  //file upload ne gp
  const uploadImage = async (uri) => {
    console.log("start uploading.");
    console.log(uri);
  const response = await fetch(uri);
  console.log(response);
  const blob = await response.blob();
  console.log("BLOB",blob);
  console.log("Status of storage",storage);

const timestamp = new Date().getTime(); // Get a timestamp instead of using toISOString()
// const storageRef = storage.ref().child(`images/${timestamp}`);

const storageRef = ref(storage, `images/${blob.name}`)
const upload = uploadBytesResumable(storageRef, blob);

//lah
upload.on("state_changed",(snapshot) => {
  const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
},(error) => {
  console.log(error);
},
() => {
  getDownloadURL(upload.snapshot.ref)
    .then((url) => {
      console.log("File uploaded successfully");
      console.log(url);
      // firebaesDocumentUpload(url);
      console.log("BEFORE FIRESTORE CALL");
      storeDataInFirestore(url,textInput)
    })
    .catch((error) => {
      console.log(error);
    });
}
)


console.log("UPLOAD", upload);


  // const storageRef = storage.ref().child(`images/${new Date().toISOString()}`);
  console.log("Storage REF",storageRef);
  // await storageRef.put(blob);

  
  // return getDownloadURL(upload.snapshot.ref)
  // .then((url) => {
  //   console.log("File uploaded successfully");
  //   console.log(url);
  //   // firebaesDocumentUpload(url);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
 
};






  return (
    <View style={styles.container} >
    <Button title="Pick Image" onPress={pickImage} />
    {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
    <TextInput
      placeholder="Enter text"
      onChangeText={(text) => setTextInput(text)}
      value={textInput}
    />
    <Button title="Upload Data" onPress={uploadData} />
  </View>
  
  )
}

export default FileUpload

const styles = StyleSheet.create({
    container:{
      marginTop:90,
        felex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
    }, 
    selectButton:{
      borderRadius:5,
      width:130,
      height:123,
      backgroundColor:'blue',
    },
    imageContainer:{
      marginTop:30,
      marginBottom:50,
      alignItems:'center'
    }
})