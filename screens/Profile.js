import React, { useState,useEffect  } from 'react';
import { View, Text,TouchableOpacity, TextInput, Button ,ScrollView,StyleSheet} from 'react-native';
import { getAuth,updateProfile  } from "firebase/auth";
import * as firebase from 'firebase/app';

const Profile = () => {
const auth = getAuth();


const [displayName, setDisplayName] = useState('');
const [user, setUser] = useState(null);

useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {

            const uid = currentUser.uid;
            setUser(currentUser);

          } else {
            // User is signed out
            // ...
          }


    //   setUser(currentUser);
    //   if (currentUser) {
    //     setDisplayName(currentUser.displayName);
    //   }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, []);

const updateProfile = async () => {
    if (user) {
      try {
        await updateProfile(auth.currentUser,{
          displayName: displayName
        });
        // Profile updated successfully
        console.log('User profile updated successfully');
      } catch (error) {
        console.error('Error updating user profile:', error.message);
      }
    } else {
      console.error('No user is currently logged in');
    }
  };
  return (
    <ScrollView style={styles.main_container}>
    <View style={{ marginBottom: 30 }}>
      <Text style={styles.header_text}>Create an Account</Text>
    </View>
    <View>
    <View>
      {displayName ? (
        <Text>Hello, {displayName}!</Text>
      ) : (
        <Text>Please sign in or create an account.</Text>
      )}
    </View>
      <Text>Update Display Name</Text>
      <TextInput
        placeholder="Enter new display name"
        value={displayName}
        onChangeText={text => setDisplayName(text)}
      />
      <Button title="Update" onPress={updateProfile} />
    </View>

    {/* <Text style={styles.input_lable}>First Name</Text>
    <TextInput
      style={styles.input_text}
      placeholder="Enter First name"
      value={displayName}
      onChangeText={value=>setDisplayName(value)}
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
    ></TextInput> */}
  </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      top: 20,
      padding: 15,
    },
    header_text: {
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
  });