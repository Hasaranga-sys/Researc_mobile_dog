import React, { useState,useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
// import firebase from 'firebase/app';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid'


import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
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
import app from '../firebase/firebase-config';
import { storage } from '../firebase/firebase-config'; // Import your Firebase storage instance
import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance
import {getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config'; 


const Scan = () => {
  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
  const [file3, setImage3] = useState(null);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [user, setUser] = useState();
  const [uid,setUid] = useState();
  const [result, setResult] = useState()
  const [resultData, setResultData] = useState();
  const auths = getAuth();
  const settingResult = null;
  const [isUploading, setIsUploading] = useState(false);
  

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

   // Set up the authentication state listener
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("AUTH USER", authUser.uid);
      setUid(authUser.uid)
      setUser(authUser);
    });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("RESU", result);
  }, [result]);

  const handleUpload = async () => {
    console.log("upload button clicked");
    setIsUploading(true);
    if (!file1 || !file2 || !file3) {
      alert("Error: All three files are required.");
      setIsUploading(false);
      return;
    }else if(!age){
      alert("Error: Please Enter Age");
      setIsUploading(false);
      return;
    }else if(!weight){
      alert("Error: Please Enter Weight");
      setIsUploading(false);
      return;
    }



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

      formData.append('age', age); 
      formData.append('weight', weight); 


      try {
        
        //alwas check the Link in the backend it can be change when you resetart the application
        const response = await axios.post('http://192.168.163.46:8081/second', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
 
        if (response && response.data) {
          const { results: { med: { control, medicines }, header: { age, weight }, predictions: { confidence, classs } } } = response.data;
          const settingResult = {medicines,control,age,weight,confidence,classs};

          uploadImage(file1,file2,file3,settingResult);
      
          
        } else {
          ToastAndroid.show('Error: No response or response data received.', ToastAndroid.SHORT);
          setIsUploading(false);
          console.error("Error: No response or response data received.");
          
        }
        
        
      } catch (error) {
        ToastAndroid.show('Error:Server 404 ', ToastAndroid.SHORT);
        setIsUploading(false);
        console.error('Axios error:', error);

      }

      // showToastWithGravity()
    } catch (error) {
      setIsUploading(false);
      console.error('Error uploading images:', error);
    }
  };


  //old working
  // const uploadImage = async (file1,file2,file3,settingResult) => {
  //   console.log("settingRESULTLOG",settingResult);
  //     console.log("UPLOAD IMAGE LOG", file1,file2,file3);
  //     const response = await fetch(file1,file2,file3);
  //     const blob = await response.blob();
  //     console.log("BLOB",blob);
     
  //     const name = blob._data.name;
  //     console.log("BLOB NAME", name);

  //     const storageRef = ref(storage, `images/${blob._data.name}`)
  //     const upload = uploadBytesResumable(storageRef, blob);

  //     upload.on("state_changed",(snapshot) => {
  //       const progress =
  //                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //                 console.log("Upload is " + progress + "% done");
  //     },(error) => {
  //       console.log(error);
  //     },() => {
  //       getDownloadURL(upload.snapshot.ref)
  //         .then((url) => {
  //           console.log("File uploaded successfully");
  //           console.log(url);
  //           // firebaesDocumentUpload(url);
  //           console.log("BEFORE FIRESTORE CALL");
  //           console.log("RRRRRRR",result);
            
  //           // storeDataInFirestore(file1,file2,file3,result,user)
           
  //             console.log("BEFORE CALL", settingResult);
  //             storeDataInFirestore(url, file2, file3, settingResult);
           
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
      
  //     )

  // }

 /**
  * Image Uploading Function 
  */

  const uploadImage = async (file1,file2,file3,settingResult) => {
                           
                              
        const response = await fetch(file1);
        const blob = await response.blob();

        const storageRef1 = ref(storage, `images/${blob._data.name}`);
        const upload = uploadBytesResumable(storageRef1, blob);
        // console.log("UPLAOD !",upload);
        let downloadURL1;

            upload.on("state_changed", (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
          });

                upload.then(async(snapshot) => {
                  // console.log("COMES DOWN TO UPLOAD ONE");      
                  downloadURL1 = await getDownloadURL(snapshot.ref);
                  // console.log("downloadURL 1q",downloadURL1 );


                        // Upload file2
                      const response2 = await fetch(file2);
                      const blob2 = await response2.blob();

                      const storageRef2 = ref(storage, `images/${blob2._data.name}`);
                      const upload2 = uploadBytesResumable(storageRef2, blob2);
                      let downloadURL2;

                      upload2.on("state_changed", (snapshot) => {
                          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          console.log("Upload is " + progress + "% done");
                      });

                          upload2.then(async(snapshot2) => {
                            console.log("COMES DOWN TO UPLOAD TWO");   
                            downloadURL2 = await getDownloadURL(snapshot2.ref);
                            console.log("downloadURL 2q",downloadURL2 );

                              // Upload file3
                              const response3 = await fetch(file3);
                              const blob3 = await response3.blob();

                              const storageRef3 = ref(storage, `images/${blob3._data.name}`);
                              const upload3 = uploadBytesResumable(storageRef3, blob3);
                              let downloadURL3;

                                  upload3.on("state_changed", (snapshot) => {
                                      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                      console.log("Upload is " + progress + "% done");
                                  });

                                        upload3.then(async(snapshot3)=>{
                                          downloadURL3 = await getDownloadURL(snapshot3.ref);
                                          console.log("COMES TO THE #RD ONE");

                                          console.log("All files uploaded successfully");
                                            console.log("Download URLs:", downloadURL1, downloadURL2, downloadURL3);

                                            // Once all files are uploaded, pass downloadURLs as separate parameters to storeDataInFirestore
                                            storeDataInFirestore(downloadURL1, downloadURL2, downloadURL3, settingResult);
                                        })



                          })
                })

    


  }
  //sample method


  const storeDataInFirestore = async (file1Url,file2Url, file3Url, settingResult) => {
    console.log("Image uri and text input IN FIRESTORE CALL : 1",file1Url);
    console.log("Image uri and text input IN FIRESTORE CALL : 2",file2Url);
    console.log("Image uri and text input IN FIRESTORE CALL : 3",file3Url);

    console.log("autho",auth.currentUser.email);
    
    console.log("udi-ages",settingResult);
    setResultData(settingResult);
  

    try {
      const predictionsCollectionRef = collection(db,'Original_Predic')
      await setDoc(doc(predictionsCollectionRef),{
      file1 : file1Url,
      file2 : file2Url,
      file3 : file3Url,

      user:{
        email:auths.currentUser.email,
      },
   
      results:{
        age:settingResult.age,
        classs:settingResult.classs,
        weight:settingResult.weight,
        confidence:settingResult.confidence,
        control:settingResult.control,
        medicines:settingResult.medicines,

      },       
      timestamp: new Date(),
      })
      ToastAndroid.showWithGravity(
        'Data stored successfully in Firestore!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      setIsUploading(false);
      console.log("Data stored successfully in Firestore!");
      
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error storing data in Firestore', ToastAndroid.SHORT, ToastAndroid.BOTTOM,
      );
      setIsUploading(false);
      console.error("Error storing data in Firestore:", error);
    }


  };

  //new one with promise
  const fetchDataAndSaveTofirebase = () =>{
    return new Promise((resolve,reject) =>{
      handleUpload()
    })
  }

  const showToastWithGravity = () => {
    ToastAndroid.showWithGravity(
      'Files Uploaded Succesfully',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

 
  return (
    <View style={styles.container}>



    <View style={styles.headerRow}>
        <Text style={{padding: 7, marginTop:50, margin:0, fontSize:25,fontWeight:"900"}}>Image Scan</Text>
        <Image style={{height:100,width:100,top:20,right:9}} source={require("../assets/selfie.png")}/>
        </View>
        <ScrollView style={{ backgroundColor: "##ccc9e6", flex: 1, paddingHorizontal: 10 }} >
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

                <View >
                  <View style={styles.rowInput}>
                      <Text style={styles.inputLabel}>Enter Age        :</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Age"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                          />
                  </View>
                  <View style={styles.rowInput}>
                      <Text style={styles.inputLabel}>Enter Weight  :</Text>
                          <TextInput
                              style={styles.input}
                              placeholder="Enter Weight"
                              keyboardType="numeric"
                              value={weight}
                              onChangeText={setWeight}
                            />
                  </View>
              </View> 

              <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
               <View style={styles.button}>
                  <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Submit'}</Text>
               </View>
          </TouchableOpacity>
          

            {/* <Button title="Set Data to firebase" onPress={storeDataInFirestore} /> */}
            </View>
            <View>
            {resultData && ( // Check if resultData exists
                <View style={styles.cardh}>
                  <Text style={{width:220, fontWeight:"600", fontSize:20}}>Results</Text>
                  <Text style={{ fontWeight: 'bold' }}>Age                 : {resultData?.age}</Text>
                  <Text style={{ fontWeight: 'bold' }}>Weight            : {resultData?.weight}</Text>
                  <Text style={{ fontWeight: 'bold' }}>Confidence     : {resultData?.confidence}</Text>
                  <Text style={{ fontWeight: 'bold' }}>Class               : {resultData?.classs}</Text>
                  <Text style={{ fontWeight: 'bold' }}>Control Steps :</Text>
                  <View>
                    {resultData?.control.map((step, index) => (
                      <Text key={index}>{index + 1}. {step}</Text>
                    ))}
                  </View>
                  <Text style={{ fontWeight: 'bold' }}>Medicines:</Text>
                  <View>
                    {resultData?.medicines.map((step, index) => (
                      <Text key={index}>{index + 1}. {step}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
           
          </View>
        </ScrollView>

   </View>  

  
   
  )
}

export default Scan

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
imageButton:{
  padding:5,
 width:160, fontWeight:"600", fontSize:20
},
inputLabel:{
padding:3,
 width:120,
 fontWeight:"600",
  fontSize:13
},
submitButton:{
padding:5,
 width:160, fontWeight:"600", fontSize:20,justifyContent:"center"
},
 headerRow:{
  flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width:"95%",
    left:10
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
  rowInput: {
    flexDirection: "row",
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
  },
  input: {
    height: 40,
    width:"60%",
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop:8,
    backgroundColor: '#4CAF50', // Adjust background color
    borderRadius: 25, // Adjust curvature
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white', // Adjust text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});