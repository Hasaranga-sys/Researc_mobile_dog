import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
// import firebase from 'firebase/app';
import "react-native-get-random-values";


import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db, storage } from '../firebase/firebase-config'; // Import your Firebase storage instance
import { RadioButton,Checkbox} from 'react-native-paper'


const Scan = () => {
  const [file1, setImage1] = useState(null);
  const [file2, setImage2] = useState(null);
  const [file3, setImage3] = useState(null);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [active,setActive] = useState('');
  const [temp, setTemp] = useState();
  const [user, setUser] = useState();
  const [uid,setUid] = useState();
  const [result, setResult] = useState()
  const [resultData, setResultData] = useState();
  const auths = getAuth();
  const settingResult = null;
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = React.useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedSymptom, setSelectedSymptom] = React.useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsFalse, setShowDetailsFalse] = useState(false);
  const [firestoreDownloadUrl1,setFirestoreDownloadUrl1] = useState();
  const [firestoreDownloadUrl2,setFirestoreDownloadUrl2] = useState();
  const [firestoreDownloadUrl3,setFirestoreDownloadUrl3] = useState();
  // const [seResult, setSeResult] = useState();
  let activeStatus = 'No';
  let behaviourSelected = '';
  let symtomSelected = '';
  let testSelected ='';

  const behaviors_keratosis = [
    'Reluctance to Walk',
    'Scratching the infected area',
    'Rubbing Face',
    'Limping or Favoring a Paw',
    ' Licking and Chewing the infected area'

  ];

  const symptoms_keratosis = [
    'Thickened Skin',
    'Crusty Patches',
    'Discoloration',
    'Cracks in the infected area',
    'Dryness in the infected area'

  ];

  const test_keratosis = [
    'Touch and feel if the affected areas are rough',
  ];


  const behaviors_mange = [
    'Excessive Scratching',
    'Restlessness',
    'Rubbing Against Surfaces',
    ' Avoidance of Touch in the infected areas'
  ];

  const symptoms_mange = [
    'Hair Loss in the area',
    'Redness of the area',
    ' Lesions and Scabs in the area'    
  ];

  const test_mange = [
    'Full Blood Count (FBC) (Optional)',
  ];

  const behaviour_Nasal_Discharge = [
    'Sneezing',
    'Coughing',
    'Labored Breathing',
    'Rubbing or pawing at nose and face',
    'Appetite loss',
    'Trouble breathing through nose'
  ];

  const symptom_Nasal_Discharge = [
    'Wet, runny nose for longer than 24 hours',
    'Red, swollen or puffy eyes',
    'Thick Yellow, Green, White or Bloody Discharge',
    'Thick, sticky mucus',
    'Unpleasant Smell',
    'Crusting Around Nostrils'
  ];

  const test_Nasal_Discharge = [
    ' A Cytology tests for Nasal Discharge report can be taken and presented to the doctor for further clarification of the disease',
    
  ];
  

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
    }else if(!temp){
      alert("Error: Please Enter Tempreture");
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
      formData.append('temp',temp);
      formData.append('active',active);


      try {
        
        //alwas check the Link in the backend it can be change when you resetart the application
        const response = await axios.post('API_URL', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("after request");
 
        if (response && response.data) {
          console.log("response data", response.data);
          const { results: { med: { control, medicines }, header: { age, weight,temp,active }, predictions: { confidence, classs },disease } } = response.data;
          const settingResult = {medicines,control,age,weight,temp,active,confidence,classs,disease};

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
                                            // setFirestoreData(downloadURL1, downloadURL2, downloadURL3, settingResult)
                                            setFirestoreDownloadUrl1(downloadURL1);
                                            setFirestoreDownloadUrl2(downloadURL2);
                                            setFirestoreDownloadUrl3(downloadURL3)
                                          

                                            console.log("udi-ages-setResultdata",settingResult);
                                            setResultData(settingResult);

                                            setIsUploading(false);

                                            console.log("getting the temp",settingResult.temp);
                                              if(settingResult.temp >= 30){
                                                console.log("Tempreture log inside");
                                                activeStatus = 'No'
                                                ToastAndroid.showWithGravity(
                                                  'Your pet Might have the fever!!',
                                                  ToastAndroid.LONG,
                                                  ToastAndroid.BOTTOM,
                                                );
                                                storeDataInFirestore(downloadURL1, downloadURL2, downloadURL3, settingResult);
                                              }else if(settingResult.classs == "UNKNOWN"){
                                                console.log("Unknown log inside");
                                                activeStatus = 'No'
                                                ToastAndroid.showWithGravity(
                                                  'System Cannot Predict the Results !!',
                                                  ToastAndroid.LONG,
                                                  ToastAndroid.BOTTOM,
                                                );
                                                storeDataInFirestore(downloadURL1, downloadURL2, downloadURL3, settingResult);                                          
                                              }


                                            // storeDataInFirestore(downloadURL1, downloadURL2, downloadURL3, settingResult);

                                        })



                          })
                })

    


  }
  //sample method


  const storeDataInFirestore = async (file1Url,file2Url, file3Url, settingResult) => {
    console.log("Image uri and text input IN FIRESTORE CALL : 1",file1Url);
    console.log("ACTIVESTATUS_IN FIRESTOE",activeStatus);
    console.log("Image uri and text input IN FIRESTORE CALL : 2",file2Url);
    console.log("Image uri and text input IN FIRESTORE CALL : 3",file3Url);

    console.log("autho",auth.currentUser.email);
    
    console.log("udi-ages",settingResult);
    //comment this for test this is original
    // setResultData(seResult);
    console.log("ADDING BEHAVOIR ",behaviourSelected);
    console.log("ADDING SYMPTOM ",symtomSelected);
    console.log("ADDING TEST",testSelected);
  

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
        active:activeStatus,
        behavoir:behaviourSelected,
        symptom:symtomSelected,
        test:testSelected,
        temp:settingResult.temp,
        confidence:settingResult.confidence,
        control:settingResult.control,
        medicines:settingResult.medicines,

      },       
      timestamp: serverTimestamp(),
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

  
  const handleBehaviorChange = (itemValue) => {
    console.log("Behavoiur selected",itemValue);
    // setSelectedBehavior(itemValue);
    if (selectedBehavior.includes(itemValue)) {
      // Remove the behavior if it's already selected
      setSelectedBehavior(selectedBehavior.filter(b => b !== itemValue));
    } else {
      // Add the behavior to the selected list
      setSelectedBehavior([...selectedBehavior, itemValue]);
    }
    setShowDetails(false); // Reset details on behavior change
  };

  const handleTestChange = (itemValue) => {
    console.log("Test selected",itemValue);
    setSelectedTest(itemValue);
    // setShowDetails(false); // Reset details on behavior change
  };

  const handleSymptomChange = (itemValue) => {
    console.log("Symtopm selected",itemValue);
    setSelectedSymptom(itemValue);

    if (selectedSymptom.includes(itemValue)) {
      // Remove the behavior if it's already selected
      setSelectedSymptom(selectedSymptom.filter(b => b !== itemValue));
    } else {
      // Add the behavior to the selected list
      setSelectedSymptom([...selectedSymptom, itemValue]);
    }





    setShowDetails(false); // Reset details on symptom change
  };

  const handleShowDetails = () => {
    console.log("handleShowDetails");
    activeStatus = 'No'

    if(selectedBehavior.includes('Scratching the infected area') && selectedSymptom.includes('Thickened Skin')){
      console.log("URL1", firestoreDownloadUrl1);
      console.log("URL2", firestoreDownloadUrl2);
      console.log("URL3", firestoreDownloadUrl3);
      console.log("dataset", resultData);
      activeStatus = 'Yes'
      console.log("ACTIVE",activeStatus)
      console.log("ACTIVE_FLAG",resultData.active);
      setShowDetails(true)

      // setResultData(resultData);

    }else if(selectedBehavior.includes('Excessive Scratching') && selectedSymptom.includes(' Hair Loss in the area')){
      activeStatus = 'Yes'
      setShowDetails(true)
      // setResultData(seResult);

    }else if(selectedBehavior.includes('Sneezing') && selectedSymptom.includes('Thick Yellow, Green, White or Bloody Discharge')){
      activeStatus = 'Yes'
      setShowDetails(true)
      
    }else{
      setShowDetailsFalse(true)
      ToastAndroid.showWithGravity(
        'System Cannot Predict the results',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
    behaviourSelected =selectedBehavior;
    symtomSelected =selectedSymptom;
    testSelected = selectedTest;


    storeDataInFirestore(firestoreDownloadUrl1, firestoreDownloadUrl2, firestoreDownloadUrl3, resultData);
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

            <View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => pickImage(setImage1)} disabled={isUploading}>
                  <Text style={styles.imageButton}>Select Image 1</Text>
                </TouchableOpacity>    
                  {file1 && <Image source={{ uri: file1 }} style={{ width: 130, height: 130 }} />}
              </View>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => pickImage(setImage2)} disabled={isUploading}>
                <Text style={styles.imageButton}>Select Image 2</Text>
              </TouchableOpacity>    
              {file2 && <Image source={{ uri: file2 }}  style={{ width: 130, height: 130  }} />}
            </View>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => pickImage(setImage3)} disabled={isUploading}>
                <Text style={styles.imageButton}>Select Image 3</Text>
              </TouchableOpacity>    
              {file3 && <Image source={{ uri: file3 }}  style={{ width: 130, height: 130 }} />}
            </View>

                <View >
                  <View style={styles.rowInput} disabled={isUploading}>
                      <Text style={styles.inputLabel}>Enter Age        :</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Age"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                            editable={!isUploading}
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
                              editable={!isUploading}
                            />
                  </View>
                  <View style={styles.rowInput}>
                      <Text style={styles.inputLabel}>Enter Tempreture  :</Text>
                          <TextInput
                              style={styles.input}
                              placeholder="Enter Tempreture"
                              keyboardType="numeric"
                              value={temp}
                              onChangeText={setTemp}
                              editable={!isUploading}
                            />
                  </View>
              </View> 
            </View>
            

              <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
               <View style={styles.button}>
                  <Text style={styles.buttonText}>{isUploading ? <ActivityIndicator size="small" color="#fff" />: 'Submit'}</Text>
               </View>
          </TouchableOpacity>
          

            {/* <Button title="Set Data to firebase" onPress={storeDataInFirestore} /> */}
            </View>
            <View >
            {resultData?.temp >= 30 ? (
                  <View style={styles.cardh}>
                  <Text style={{alignSelf:'center',color:'#ff4545' , fontWeight:"400", fontSize:16}}>Your Pet Maybe Have the Fever!!</Text>
                  
                </View>
                ) : (
                  <View>
                    {resultData?.classs == 'Keratosis' &&(
                      <View style={styles.cardh}>
                        {/* <Text style={{width:220, fontWeight:"600", fontSize:20}}>Please Select</Text> */}
                        
                           
                          {/* behaviour */}
                          <View>
                                <Text style={{ fontSize: 14,fontWeight: 'bold' }}>Select a behavior:</Text>
                                {behaviors_keratosis.map((behavior, index) => (
                                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Checkbox
                                      value={behavior}
                                      status={selectedBehavior.includes(behavior) ? 'checked' : 'unchecked'}
                                      onPress={() => handleBehaviorChange(behavior)}
                                    />
                                    <Text>{behavior}</Text>
                                  </View>
                                ))}
                              </View>





                              
                              {/* symptom */}
                              <View>
                                <Text style={{ fontSize: 14,fontWeight: 'bold' }}>Select a Symptom:</Text>
                                {symptoms_keratosis.map((symptom, index) => (
                                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Checkbox
                                      value={symptom}
                                      status={selectedSymptom.includes(symptom) ? 'checked' : 'unchecked'}
                                      onPress={() => handleSymptomChange(symptom)}
                                    />
                                    <Text>{symptom}</Text>
                                  </View>
                                ))}
                              </View>
                            

                            {/* Test */}
                            <View>
                                <Text style={{ fontSize: 14,fontWeight: 'bold' }}>Select a Test:</Text>
                                {test_keratosis.map((test, index) => (
                                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <RadioButton
                                      value={test}
                                      status={selectedTest === test ? 'checked' : 'unchecked'}
                                      onPress={() => handleTestChange(test)}
                                    />
                                    <Text>{test}</Text>
                                  </View>
                                ))}
                              </View>

                

                                          
                            <TouchableOpacity onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>{'Proceed'}</Text>
                                </View>
                            </TouchableOpacity>
                                  
                        {/* <Button title="Show Details" onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom} /> */}

                      </View>  ) }

                      {resultData?.classs == 'UNKNOWN' &&(
                              <View style={styles.cardh}>
                              <Text style={{alignSelf:'center',color:'#ff4545' , fontWeight:"400", fontSize:16}}>System Cannot Predict the Results!!</Text>
                              
                            </View>  )
                          }

                          {resultData?.classs == 'Mange' &&(
                              <View style={styles.cardh}>
                              <Text style={{width:220, fontWeight:"600", fontSize:20}}>Please Select</Text>


                              <Picker
                                    selectedValue={selectedBehavior}
                                    onValueChange={handleBehaviorChange}
                                    mode="dropdown" 
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a Bahavoiur..." value="" />
                                      {behaviors_mange.map((symptom, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={symptom} value={symptom} />
                                      ))}
                                    
                                  </Picker>  
                            

                                  <Picker
                                    selectedValue={selectedSymptom}
                                    onValueChange={handleSymptomChange}
                                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a symptom..." value="" />
                                      {symptoms_mange.map((symptom, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={symptom} value={symptom} />
                                      ))}
                                    
                                  </Picker>      

                                  <Picker
                                    selectedValue={selectedTest}
                                    onValueChange={handleTestChange}
                                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a Test..." value="" />
                                      {test_mange.map((test, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={test} value={test} />
                                      ))}
                                    
                                  </Picker>            
                                  
                                  <TouchableOpacity onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom}>
                                  <View style={styles.button}>
                                      <Text style={styles.buttonText}>{'Proceed'}</Text>
                                  </View>
                              </TouchableOpacity>
                              

                            </View>  )
                          }

                          {resultData?.classs == 'Nasal_Discharge' &&(
                              <View style={styles.cardh}>
                              <Text style={{width:220, fontWeight:"600", fontSize:20}}>Please Select</Text>


                              <Picker
                                    selectedValue={selectedBehavior}
                                    onValueChange={handleBehaviorChange}
                                    mode="dropdown" 
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a Bahavoiur..." value="" />
                                      {behaviour_Nasal_Discharge.map((symptom, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={symptom} value={symptom} />
                                      ))}
                                    
                                  </Picker>  
                            

                                  <Picker
                                    selectedValue={selectedSymptom}
                                    onValueChange={handleSymptomChange}
                                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a symptom..." value="" />
                                      {symptom_Nasal_Discharge.map((symptom, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={symptom} value={symptom} />
                                      ))}
                                    
                                  </Picker>      

                                  <Picker
                                    selectedValue={selectedTest}
                                    onValueChange={handleTestChange}
                                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                                  >
                                    <Picker.Item style={{fontSize: 10}} label="Select a Test..." value="" />
                                      {test_Nasal_Discharge.map((test, index) => (
                                        <Picker.Item style={{fontSize: 10}} key={index} label={test} value={test} />
                                      ))}
                                    
                                  </Picker>            
                                  
                                  <TouchableOpacity onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom}>
                                  <View style={styles.button}>
                                      <Text style={styles.buttonText}>{'Proceed'}</Text>
                                  </View>
                              </TouchableOpacity>
                              

                            </View>  )
                          }

                             
                                  {showDetails && ( // Check if resultData exists
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

                                    {showDetailsFalse && ( // Check if resultData exists
                                      <View style={styles.cardh}>
                                        <Text style={{width:290, fontWeight:"400", fontSize:16,color:'#ff4545', alignSelf:'center',marginBottom:5,marginTop:5}}>System cannot predict the Result !!</Text>
                                        
                                      </View>
                                    )}
          </View>
                )}
              {/* {seResult?.disease == 'Keratosis' &&(
              <View style={styles.cardh}>
                <Text style={{width:220, fontWeight:"600", fontSize:20}}>Please Select</Text>
                
                    <Picker
                      selectedValue={selectedBehavior}
                      onValueChange={handleBehaviorChange}
                      mode="dropdown" // Adjust mode as needed (dropdown, modal)
                    >
                    {behaviors_keratosis.map((behavior, index) => (
                        <Picker.Item style={{fontSize:10}} key={index} label={behavior} value={behavior} /> ))} 
                    </Picker>

                    <Picker
                      selectedValue={selectedSymptom}
                      onValueChange={handleSymptomChange}
                      mode="dropdown" // Adjust mode as needed (dropdown, modal)
                    >
                      {symptoms_keratosis.map((symptom, index) => (
                        <Picker.Item style={{fontSize:10}} key={index} label={symptom} value={symptom} />
                      ))}
                    </Picker>                 
                     

                <Button title="Show Details" onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom} />

              </View> 
              )
              }
              {resultData?.disease == 'Mange' &&(
              <View style={styles.cardh}>
              <Text style={{width:220, fontWeight:"600", fontSize:20}}>Please Select</Text>
             
                  <Picker
                    selectedValue={selectedBehavior}
                    onValueChange={handleBehaviorChange}
                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                  >
                  {behaviors_keratosis.map((behavior, index) => (
                      <Picker.Item style={{fontSize:10}} key={index} label={behavior} value={behavior} /> ))} 
                  </Picker>

                  <Picker
                    selectedValue={selectedSymptom}
                    onValueChange={handleSymptomChange}
                    mode="dropdown" // Adjust mode as needed (dropdown, modal)
                  >
                    {symptoms_keratosis.map((symptom, index) => (
                      <Picker.Item style={{fontSize:10}} key={index} label={symptom} value={symptom} />
                    ))}
                  </Picker>                 
                   

              <Button title="Show Details" onPress={handleShowDetails} disabled={!selectedBehavior || !selectedSymptom} />

            </View>  )
              }

              {showDetails && (
                  <View>
                   
                    <Text>Details:</Text>
                  
                  </View>
                        )}
            {resultData?.temp == 3 &&(
              <View style={styles.cardh}>
              <Text style={{width:220, fontWeight:"600", fontSize:20}}>Tempreture warning</Text>
            

            </View>
            )}

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
              )} */}
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
    borderBlockColor:'#ff4545',
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