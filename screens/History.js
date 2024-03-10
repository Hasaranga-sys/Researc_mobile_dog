
import { ScrollView, StyleSheet, Text, View, FlatList,TouchableOpacity,Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { storage } from '../firebase/firebase-config'; // Import your Firebase storage instance
import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

const History = () => {

  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("AUTH USER", authUser);
      setUser(authUser);
    });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("USER AFTER SETTING", user);
    if (user !== null) {
      console.log("USER CONDITION", user);
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const fetchedData = await fetchFromDatabase(user);
    setData(fetchedData);
    console.log("DATASET",data);
  };
 
    // useEffect(() => {
    //     const fetchBookings = async () => {
    //       try {
    //         const token = await AsyncStorage.getItem('authToken'); // Retrieve the JWT token from AsyncStorage or any other storage mechanism
    //         const headers = {
    //           Authorization: `Bearer ${token}`,
    //         };
    //         // const response = await axiosInstance.post('http://192.168.43.172:6000/api/bookings/get-bookings-by-user-id', {}, { headers });
    //         setData(response.data.data);
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
      
    //     fetchBookings();
    //   }, []);

      const fetchFromDatabase = async(user) =>{
        try {
          // console.log("Start try");
          // const predictionsCollectionRef = collection(db,"Original_Predic");
          // console.log("Collection");
          // const snapshot = await getDocs(predictionsCollectionRef);

          //new from off doc
          console.log("Strt new");
          // const userMail = user.email;
          console.log("USER EMAIL",user.email);
          const allData = query(collection(db,"Original_Predic"),where("user.email", "==" , user.email))
          console.log("ALL data",allData);
          const dataSnapshot = await getDocs(allData)
          console.log("SNapshot_2",dataSnapshot);
          console.log("END OF SNAPSHOT");

          //checking condition
          // const docChangesArray = dataSnapshot.docChanges;
          console.log("docChangesArray",dataSnapshot.docChanges);
         
          console.log("DOCSS",dataSnapshot.docs);
          
          console.log("SIZE DOCS",dataSnapshot.size);
      
          console.log("ISEMP",dataSnapshot.empty);


          // if (Array.isArray(docChangesArray) && docChangesArray.length > 0 && docChangesArray[0] instanceof Object) {
          //     // The docChanges property contains an array with objects
          //     console.log("DocChanges has objects:", docChangesArray);
          // } else if (Array.isArray(docChangesArray) && docChangesArray.length === 0) {
          //     // The docChanges property is an empty array
          //     console.log("DocChanges is an empty array");
          // } else {
          //     // The docChanges property is not an array with objects or an empty array
          //     console.log("DocChanges is not as expected");
          // }

          if(dataSnapshot.size!=0){
            console.log(dataSnapshot);
            console.log('LIST from Firestore:', data);
  
            const data = []
            dataSnapshot.forEach((doc) =>{
              data.push({
                id: doc.id,
          file1: doc.data().file1,
          file2: doc.data().file2,
          file3: doc.data().file3,
          result: {
            percentage: doc.data().result.percentage,
            prediction: doc.data().result.prediction,
          },timestamp: doc.data().timestamp,
          user: {
            email: doc.data().user.email,
            uid: doc.data().user.uid,
          },
              })
            })
            console.log('Data from Firestore:', data);
            return data;
          }

        } catch (error) {
          console.error('Error fetching data from Firestore:', error);
    return [];
        }
      }
  

      const renderItem = ({ item }) => (

        <View style={styles.container}>      
        <View style={styles.cardh}>  
        <View style={styles.row}>
        <TouchableOpacity >
          <Text style={styles.imageButton}>Image 3</Text>
        </TouchableOpacity> 
           <Image source={{ uri: item.file1 }} style={{ width: 130, height: 130 }} />
        </View>
  
        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.imageButton}>Image 2</Text>
          </TouchableOpacity>    
           <Image source={{ uri: item.file2 }}  style={{ width: 130, height: 130  }} />
        </View>
  
        <View style={styles.row}>
          <TouchableOpacity >
            <Text style={styles.imageButton}>Image 3</Text>
          </TouchableOpacity>    
          <Image source={{ uri: item.file3 }}  style={{ width: 130, height: 130 }} />
        </View> 
        </View>
  
        {/* <View style={styles.cardh}>      
          <Text style={{width:220, fontWeight:"600", fontSize:20}}>Results</Text>
          <Text style={{marginTop:10}}>Prediction Results          : {result.prediction}</Text>
          <Text>Confidance percentage  : {result.percentage}</Text>
        </View> */}
      </View>

        // <View  style={styles.box1}>
        //   <Image source={{ uri: item.file1 }} style={{ width: 100, height: 100 }} />
        //   <Image source={{ uri: item.file2 }} style={{ width: 100, height: 100 }} />
        //   <Image source={{ uri: item.file3 }} style={{ width: 100, height: 100 }} />
        //       <Text>Result Percentage: {item.result.percentage}</Text>
        //       <Text>Result Prediction: {item.result.prediction}</Text>
        //       <Text>Timestamp: {item.timestamp.toDate().toString()}</Text>
        //       <Text>User Email: {item.user.email}</Text>
        //       <Text>User UID: {item.user.uid}</Text>
        // </View>
      );
  
        
  
  
  return (
    <View style={styles.container}>
    <View style={styles.row}>
     <Text style={{left:12, marginTop:50,marginBottom:20, margin:0, fontSize:30,fontWeight:"900"}}>History</Text>
    </View>
  <ScrollView> 
  
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
  </ScrollView>
  </View>
  
  )
}

export default History
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
    },
    imageButton: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
      color: 'blue',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 1,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 18,
    },
    fullScreenImage: {
      width: '90%',
      height: '90%',
      resizeMode: 'contain',
    },
  });