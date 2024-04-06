import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../firebase/firebase-config';
import {getAuth, signOut  } from 'firebase/auth';




export default function Home() {
  const navigation = useNavigation();
  const [data, setData] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
  ]);
  const auths = getAuth();
  

  const [modalVisible, setModalVisible] = useState(false);

  const handleProfileClick = () => {
    // Handle navigation to the profile screen
    // Add your navigation logic here
    setModalVisible(false);
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    // Handle the logout functionality
    // Add your logout logic here
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log('User signed out');
      navigation.navigate('Login')
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

  const goToProfile = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log('User signed out');
      navigation.navigate('Login')
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };
    
  return (
    <ScrollView style={{ backgroundColor: "##ccc9e6", flex: 1, paddingHorizontal: 10 }} >
    <View style={styles.row}>
     <Text style={{padding: 7, marginTop:50, margin:0, fontSize:40,fontWeight:"900"}}>Pet Care</Text>
     <TouchableOpacity onPress={toggleDropdown}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/profile.png")}
        />
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdown}>
          {/* Content of your dropdown menu */}
          <TouchableOpacity onPress={handleSignOut} style={styles.dropdownButton}>
            <Text>  Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.dropdownButton}>
            <Text>View Profile</Text>
          </TouchableOpacity>
          
         
        </View>
      )}
    </View>

  <View>     
    <View style={styles.container}>
      <View style={styles.cardh}>      
        <Text style={{color:"white",width:220, fontWeight:"600", fontSize:20}}>Your Mobile Pet care</Text>
        <Image style={{height:110,width:110,top:5}} source={require("../assets/VetHome.png")}/>
      </View>
    </View>

    <View style={styles.rowTop}>
    
    <TouchableOpacity onPress={() => navigation.navigate('Scan')}>
          <View style={styles.bcard}>           
            <View style={styles.incard}>
              <Image style={styles.buttonImage} source={require("../assets/predictHome.png")}/>
            </View>
            <Text style={styles.buttonText}>Image Scan</Text> 
          </View>
     </TouchableOpacity>
       
         
     <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <View style={styles.bcard}>          
            <View style={styles.incard}>
              <Image style={styles.buttonImage} source={require("../assets/history.png")}/>
            </View>
            <Text style={styles.buttonText}>History</Text>
          </View>
      </TouchableOpacity>
    </View>

   

    {/* map */}
    <View style={styles.rowTop}>
         
     <TouchableOpacity onPress={() => navigation.navigate('Map')}>
          <View style={styles.bcard}>          
            <View style={styles.incard}>
              <Image style={styles.buttonImage} source={require("../assets/map.png")}/>
            </View>
            <Text style={styles.buttonText}>Map</Text>
          </View>
      </TouchableOpacity>
    </View>

  


    </View>
    <View>
    </View>

   
    
    
    

  </ScrollView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    padding: 10,
  },
  imageBackground: {
    height: 30,
    width: 30,
    top: 75,
    right: 9,
  },
  dropdown: {
    position: 'absolute',
    top: 40, // Adjust this value as per your design
    right: 40, // Adjust this value as per your design
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  box: {
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
      height:300,         
      //borderBottomLeftRadius:10,

      //justifyContent: 'center',
      //alignItems: 'center',            
      //top:10
    },
       
  cardh: {
    flexDirection: "row",
    width: 660,
    overflow: "hidden",
    margin: 9,
    top: 0,
    right: 7,
    width: 367, // Set your desired width
    height: 150, // Set your desired height
    backgroundColor: '#2589f3', // Set your desired background color
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
    justifyContent: "space-between",
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


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOption: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalCancelText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});