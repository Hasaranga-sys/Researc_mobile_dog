import React, { useState,useEffect  } from 'react';
import { View, Text,TouchableOpacity,ImageBackground, ActivityIndicator,TextInput, Button,ToastAndroid ,ScrollView,StyleSheet} from 'react-native';
import { getAuth,updateProfile  } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from '../firebase/firebase-config';



const Profile = () => {
  // const auth = getAuth();
  const [user, setUser] = useState(null);

  // const [newDisplayName, setNewDisplayName] = useState('');

  const { currentUser } = getAuth(); // Assuming you have a custom hook to access the current user
  const [userData, setUserData] = useState(null);

  const [newDisplayName, setNewDisplayName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'Registerd_User', currentUser.uid); // Updated reference creation
          const userDocSnap = await getDoc(userDocRef); // Updated data fetching using getDoc
          console.log("docsnap",userDocSnap.data());

          if (userDocSnap.exists) {
            const userData = userDocSnap.data();
            setUserData(userData);
            setNewFirstName(userData.firstName);
            setNewLastName(userData.lastName);
            setNewAddress(userData.address);
            setEmail(userData.email);
          } else {
            console.log('User data not found');
          }
         console.log("dat", userData);
        } catch (error) {
          console.error('Error fetching user datax:', error);
        }finally {
          setLoading(false); // Set loading state to false after fetching data
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     setUser(currentUser);
  //   });

  //   return unsubscribe;
  // }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(currentUser, {
        // displayName: newDisplayName,
        address: newAddress,
        firstName: newFirstName,
        lastName: newLastName,
        // Add additional fields to update as needed
      });

      // Update user data in Firestore
      const userDocRef = doc(db, 'Registerd_User', currentUser.uid);
      await setDoc(userDocRef, {
        // displayName: newDisplayName,
        address: newAddress,
        firstName: newFirstName,
        lastName: newLastName,
        // Add additional fields to update as needed
      });

      // Update local state with new user data
      // setUserData({
      //   ...userData,
      //   // displayName: newDisplayName,
      //   address: newAddress,
      //   firstName: newFirstName,
      //   lastName: newLastName,
      //   // Add additional fields to update as needed
      // });

      console.log("UPDATE",setDoc);

      // Clear input fields
      // setNewDisplayName('');
      setNewAddress(newAddress);
      setNewFirstName(newFirstName);
      setNewLastName(newLastName);
      setEmail()
      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      console.log('Profile updated successfully!');
    } catch (error) {
      ToastAndroid.show('Error updating profile', ToastAndroid.SHORT);
      console.error('Error updating profile:', error.message);
    }
  };
  
  // const handleDisplayNameUpdate = async () => {
  //   try {
  //     await updateProfile(user,{ displayName: newDisplayName });
  //     setUser({ ...user, displayName: newDisplayName }); // Update local state
  //     setNewDisplayName(''); // Clear input field
  //   } catch (error) {
  //     console.error('Error updating display name:', error);
  //     // Handle error appropriately, e.g., display an error message to the user
  //   }
  // };

  return (

    <ScrollView style={styles.main_container}>
    <View style={{ marginBottom: 50 }}>
    <Text style={styles.header_text}>Profile Details</Text>
    <ImageBackground style={{height:200, width:200, left:80,top:20}} source={require("../assets/woman.png")}></ImageBackground>

    </View>
    <View style={styles.container}>
      
      {userData && (

        <View>

            <View style={styles.cardh}>
            <Text style={styles.input_lable}>First Name</Text>
            <TextInput
              style={styles.input_text}
              placeholder="Enter First Name"
              value={newFirstName}
              onChangeText={setNewFirstName}
            ></TextInput>

            <Text style={styles.input_lable}>Last Name</Text>
            <TextInput
              style={styles.input_text}
              placeholder="Enter Last Name"
              value={newLastName}
              onChangeText={setNewLastName}
            ></TextInput>

            <Text style={styles.input_lable}>Address</Text>
            <TextInput
              style={styles.input_text}
              placeholder="Enter Address"
              value={newAddress}
              onChangeText={setNewAddress}
            ></TextInput>
{/* 
            <Text style={styles.input_lable}>Email</Text>
            <TextInput
              style={styles.input_text}
              keyboardType="email-address"
              placeholder="Enter Email"
              value={email}
              editable={false}
            ></TextInput> */}

          <TouchableOpacity onPress={handleUpdateProfile}>
               <View style={styles.button}>
                  <Text style={styles.buttonText}>Update Profile</Text>
               </View>
          </TouchableOpacity>
           
  

            </View> 




          {/* <Text>Display Name:</Text>
          <TextInput
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            style={styles.input}
          /> */}
 
        </View>
      )}
    </View>
  
    
  </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
  main_container: {
    height:"auto",
    flex: 2,
    top: 20,
    padding: 15,
  },
  header_text: {
    marginTop:20,
    fontSize: 25,
    fontWeight: "700",
    color: "#130160",
    textAlign: "center",
  },
  input_text: {
    borderColor: "#67afff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 10,
    marginVertical: 5,
  },
  input_lable: {
    color: "#0D0140",
    marginVertical: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  cardh: {
    overflow: "hidden",    
    justifyContent: 'center',
    width: "100%", // Set your desired width
    marginBottom:50,
    backgroundColor: '#e1e4ed', // Set your desired background color
    padding: 16,
    borderRadius:25,
  
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