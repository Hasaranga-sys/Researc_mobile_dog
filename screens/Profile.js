import React, { useState,useEffect  } from 'react';
import { View, Text,TouchableOpacity, ActivityIndicator,TextInput, Button ,ScrollView,StyleSheet} from 'react-native';
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
            setUserData(userDocSnap.data());
                       // Populate input fields with current user data
                       setNewFirstName(userDocSnap.firstName);
                       setNewAddress(userDocSnap.address);
                       
                       setNewLastName(userDocSnap.lastName);
                       setEmail(userDocSnap.email)
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
  }, [currentUser, db]);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     setUser(currentUser);
  //   });

  //   return unsubscribe;
  // }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(currentUser, {
        displayName: newDisplayName,
        // address: newAddress,
        // firstName: newFirstName,
        // lastName: newLastName,
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
      setUserData({
        ...userData,
        // displayName: newDisplayName,
        address: newAddress,
        firstName: newFirstName,
        lastName: newLastName,
        // Add additional fields to update as needed
      });

      // Clear input fields
      // setNewDisplayName('');
      setNewAddress('');
      setNewFirstName('');
      setNewLastName('');

      console.log('Profile updated successfully!');
    } catch (error) {
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
    <Text style={styles.header_text}>Sign Up!!</Text>
    
    {/* <ImageBackground style={{height:200, width:200, left:80,top:20}} source={require("../assets/mother.png")}></ImageBackground> */}
    </View>
    <View style={styles.container}>
      
      {userData && (

        <View>

                          <View style={styles.cardh}>
                          <Text style={styles.input_lable}>First Name</Text>
                          {/* <TextInput
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

                          <Text style={styles.input_lable}>Email</Text>
                          <TextInput
                            style={styles.input_text}
                            keyboardType="email-address"
                            placeholder="Enter Email"
                            value={email}
                            
                          //   onChangeText={(val) => handleChangeText("email", val)}
                          ></TextInput> */}


                          <Button title="Update Profile" onPress={handleUpdateProfile} />
{/* 
                          <TouchableOpacity
                            style={{
                              alignContent: "center",
                              marginTop: 20,
                              backgroundColor: "#0D47A1",
                              height: 45,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 7,
                            }}
                            // onPress={() => signin()}
                            onPress={handleSubmit}
                            underlayColor="#0084fffa"
                          >
                            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                              SIGN UP
                            </Text>
                          </TouchableOpacity> */}
                          </View> 




          {/* <Text>Display Name:</Text>
          <TextInput
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            style={styles.input}
          /> */}
          <Text>Address:</Text>
          <TextInput
            value={newAddress}
            onChangeText={setNewAddress}
            style={styles.input}
          />
          <Text>First Name:</Text>
          <TextInput
            value={newFirstName}
            onChangeText={setNewFirstName}
            style={styles.input}
          />
          <Text>Last Name:</Text>
          <TextInput
            value={newLastName}
            onChangeText={setNewLastName}
            style={styles.input}
          />
          <Button title="Update Profile" onPress={handleUpdateProfile} />
        </View>
      )}
    </View>
  
    
  </ScrollView>
//neww


/** <View style={styles.cardh}>
<Text style={styles.input_lable}>First Name</Text>
<TextInput
  style={styles.input_text}
  placeholder="Enter First Name"
  value={firstName}
  onChangeText={value=>setFirstName(value)}
></TextInput>

<Text style={styles.input_lable}>Last Name</Text>
<TextInput
  style={styles.input_text}
  placeholder="Enter Last Name"
  value={lastName}
  onChangeText={value=>setLastName(value)}
></TextInput>

<Text style={styles.input_lable}>Address</Text>
<TextInput
  style={styles.input_text}
  placeholder="Enter Address"
  value={address}
  onChangeText={value=>setAddress(value)}
></TextInput>

<Text style={styles.input_lable}>Email</Text>
<TextInput
  style={styles.input_text}
  keyboardType="email-address"
  placeholder="Enter Email"
  value={email}
  onChangeText={value=>setEmail(value)}
//   onChangeText={(val) => handleChangeText("email", val)}
></TextInput>
<Text style={styles.input_lable}>Password</Text>
<TextInput
  style={styles.input_text}
  secureTextEntry={true}
  placeholder="Enter password"
  value={password}
  onChangeText={value=>setPassword(value)}
//   onChangeText={(val) => handleChangeText("password", val)}
></TextInput>

<TouchableOpacity
  style={{
    alignContent: "center",
    marginTop: 20,
    backgroundColor: "#0D47A1",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  }}
  // onPress={() => signin()}
  onPress={handleSubmit}
  underlayColor="#0084fffa"
>
  <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
    SIGN UP
  </Text>
</TouchableOpacity>
</View> */
//olddd

//     <ScrollView style={styles.main_container}>
// <View>
//       {/* <h1>Profile Page</h1> */}
//       {userData ? (
//         <View>
//           <Text>Display Name: {userData.displayName}</Text>
//           {/* <p>Email: {currentUser.email}</p> Access email from currentUser */}
//           <Text>Address: {userData.address}</Text>
//           <Text>First Name: {userData.firstName}</Text>
//           <Text>Last Name: {userData.lastName}</Text>
//           {/* You can display other user information here */}
//         </View>
//       ) : (
//         <Text>Loading...</Text>
//       )}
//     </View>
//       {/* /display name  */}
//      <View style={styles.container}>
//       {user ? (
//         <>
//           <Text style={styles.text}>Display Name: {user.displayName}</Text>
//           <TextInput
//             style={styles.input}
//             value={newDisplayName}
//             onChangeText={setNewDisplayName}
//             placeholder="Enter new display name"
//           />
//           <Button title="Update Display Name" onPress={handleDisplayNameUpdate} />
//           <Text style={styles.text}>Email: {user.email}</Text>
//         </>
//       ) : (
//         <Text>You are not currently signed in.</Text>
//       )}
//     </View>

   
    
//   </ScrollView>
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
});