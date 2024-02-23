import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import firebase from 'firebase/app';
import { getStorage } from "firebase/storage";
import { storage } from '../firebase/firebase-config';


import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TextInput, ImagePickerResult, Platform, ToastAndroid
} from "react-native";
import app from '../firebase/firebase-config';
const Scan = () => {
  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
  const [file3, setImage3] = useState(null);

  const pickImage = async (setImage) => {
    let result;
    if (Platform.OS !== 'web') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file1', {
        uri: file1,
        name: 'file1.jpg',
        type: 'image/jpg',
      });
      formData.append('file2', {
        uri: file2,
        name: 'file2.jpg',
        type: 'image/jpg',
      });
      formData.append('file3', {
        uri: file3,
        name: 'file3.jpg',
        type: 'image/jpg',
      });

      const response = await axios.post('http://192.168.202.46:8081/second', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      console.log("all rsp" ,response)
      //firebase
      const storageRef = firebase.getStorage(app).ref();

      const uploadPromises = [];
      [file1, file2, file3].forEach(async (file, index) => {
        if (file) {
          const imageRef = storageRef.child(`images/file${index + 1}.jpg`);
          const response = await fetch(file);
          
          // Immediately-invoked async function to handle blob creation
          const blob = await (async () => await response.blob())();
  
          uploadPromises.push(imageRef.put(blob));
        }
      });
  
      await Promise.all(uploadPromises);
  
      // Get download URLs
      const downloadUrls = await Promise.all(
        uploadPromises.map((uploadTask) => uploadTask.snapshot.ref.getDownloadURL())
      );
  
      console.log('Download URLs:', downloadUrls);
  


      showToastWithGravity()
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      'Files Uploaded Succesfully',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

 
  return (
    <ScrollView style={{ backgroundColor: "##ccc9e6", flex: 1, paddingHorizontal: 10 }} >

  <View style={styles.headerRow}>
     <Text style={{padding: 7, marginTop:50, margin:0, fontSize:25,fontWeight:"900"}}>Image Scan</Text>
     <Image style={{height:100,width:100,top:20,right:9}} source={require("../assets/selfie.png")}/>
    </View>




    <View style={styles.container}>      
      <View style={styles.cardh}>  
      <View style={styles.row}>
        <TouchableOpacity onPress={() => pickImage(setImage1)}>
          <Text style={styles.imageButton}>Select Image 1</Text>
        </TouchableOpacity>    
          {file1 && <Image source={{ uri: file1 }} style={{ width: 130, height: 130 }} />}
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => pickImage(setImage2)}>
          <Text style={styles.imageButton}>Select Image 2</Text>
        </TouchableOpacity>    
         {file2 && <Image source={{ uri: file2 }}  style={{ width: 130, height: 130  }} />}
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => pickImage(setImage3)}>
          <Text style={styles.imageButton}>Select Image 3</Text>
        </TouchableOpacity>    
        {file3 && <Image source={{ uri: file3 }}  style={{ width: 130, height: 130 }} />}
      </View> 
      <Button title="Upload Images" onPress={handleUpload} />
      </View>

      <View style={styles.cardh}>      
        <Text style={{width:220, fontWeight:"600", fontSize:20}}>Results</Text>
      </View>
    </View>

      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text>Upload Images</Text>
     <Button title="Pick Image 1" onPress={() => pickImage(setImage1)} />
     {image1 && <Image source={{ uri: image1 }} style={{ width: 200, height: 200 }} />}
     <Button title="Pick Image 2" onPress={() => pickImage(setImage2)} />
    {image2 && <Image source={{ uri: image2 }} style={{ width: 200, height: 200 }} />}
     <Button title="Pick Image 3" onPress={() => pickImage(setImage3)} />
     {image3 && <Image source={{ uri: image3 }} style={{ width: 200, height: 200 }} />}
     <Button title="Upload Images" onPress={handleUpload} />
   </View> */}
    </ScrollView>
   
  )
}

export default Scan

const styles = StyleSheet.create({
imageButton:{
  padding:5,
 width:160, fontWeight:"600", fontSize:20
},
submitButton:{
padding:5,
 width:160, fontWeight:"600", fontSize:20,justifyContent:"center"
},
 headerRow:{
  flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width:"100%",
 },
       
  cardh: {
    
    width: 660,
    overflow: "hidden",
    margin: 9,
    top: 0,
    right: 7,
    width: 367, // Set your desired width

    backgroundColor: '#e1e4ed', // Set your desired background color
    padding: 16,
    borderRadius:25,
    zIndex: 1,
  },
  rowTop:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width:"88%",
    left:5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    width:"100%",
    
  },
  bcard: {
    width: "130%", // Adjust the width to fit two cards in a row with some spacing
    height: 170,
    backgroundColor: '#e1e4ed',
    padding: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems:"center",
    justifyContent:"center"
  },
  incard: {
    width: "100%", // Adjust the width to fit two cards in a row with some spacing
    height: 120,
    backgroundColor: '#fefefe',
    padding: 1,
    borderRadius: 25,
    justifyContent:"center",
    alignItems:"center"    
  },
  buttonImage:{
    height:90,width:90,position:"relative",justifyContent:"center"
  },
  buttonText:{
    top:3,fontWeight:"700"
  }
});