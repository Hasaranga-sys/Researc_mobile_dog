
import { ScrollView, StyleSheet, Text, View, ImageBackground,TouchableOpacity,Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { storage } from '../firebase/firebase-config'; // Import your Firebase storage instance
import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import MapView, {Callout,Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { useNavigation } from "@react-navigation/native";
import { markers } from '../assets/marker';
import { Picker } from '@react-native-picker/picker';
import * as Permissions from 'expo-permissions';
import {locations } from '../assets/locations'
import { ListItem } from '@rneui/themed';


const INITIAL_REGION = {
    latitude:37.33,
    longitude: -122,
    latitudeDelta:2,
    longitudeDelta:2,
};


const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


    const mapRef = useRef(null);
    
    const navigation = useNavigation();

    // const locations = [
    //   { label: 'Green Bay Stadium', latitude: 44.501344, longitude: -88.075017 },
    //   { label: 'Eiffel Tower', latitude: 48.858944, longitude: 2.347826 },
    //   { label: 'Statue of Liberty', latitude: 40.689241, longitude: -74.044586 },

    // ];



    useEffect(()=>{
        (async () => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status == 'granted') {
                const locationData = await Location.getCurrentPositionAsync({});
                setLocation(locationData.coords);
                navigation.setOptions({
                    headerRight: ()=>(
                        <TouchableOpacity onPress={focousMap}>
                            <View style={{padding:10}}>
                                <Text>Focous</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
              setErrorMsg('Permission to access location was denied');
             
            }else {
                setErrorMsg('Permission to access location was denied');
            }
      
        

          })();

    },[navigation])

    // const locations = {
    //   "GreenBayStadium": {
    //     latitude: 6.88690105808959,
    //     longitude: 79.90134650086635,
    //     latitudeDelta: 0.1,
    //     longitudeDelta: 0.1,
    //   },
    //   "efficl": {
    //     latitude: 48.858944,
    //     longitude: 2.347826,
    //     latitudeDelta: 0.1,
    //     longitudeDelta: 0.1,
    //   },
    // };

  //   const focousMap = () =>{
  //       const GreenBayStadium = {
  //           latitude: 6.88690105808959,
  //           longitude: 79.90134650086635,
  //           latitudeDelta: 0.1,
  //           longitudeDelta: 0.1}
  //           mapRef.current.animateToRegion(GreenBayStadium);
  //   };

  //   const efficl = () =>{
  //     const efficl = { 
  //       latitude: 48.858944,
  //        longitude: 2.347826,
  //        latitudeDelta: 0.1,
  //     longitudeDelta: 0.1}
  //         mapRef.current.animateToRegion(efficl);
  // };



    const onRegionChange = (region) => {
        console.log(region);
    };       

    const onMarkerSelected = (marker) => {
        Alert.alert(marker.name)
    };     

    const focusOnLocation = (locationKey) => {
      const location = locations[locationKey]; // Access location data by key
      mapRef.current.animateToRegion(location);
    };

    const handleCenterOnLocation = async () => {
        if (!location) {
          return;
        }
        const map = await mapRef.current; // Assuming you have a ref for the MapView
        map.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      };
  
  
  return (

        <View style={styles.container}>
            <View style={styles.row}>
     <Text style={{left:9, marginTop:50, margin:0, fontSize:30,fontWeight:"900"}}>Map</Text>
    </View>
   
    {/* <View>
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <ListItem.Title>Locations</ListItem.Title>
            <ListItem.Subtitle>Tap to expand</ListItem.Subtitle>
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
         {expanded && (
        <>
          {Object.keys(locations).map((locationKey) => (
            <TouchableOpacity key={locationKey} onPress={() => focusOnLocation(locationKey)}>
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>Focus on {locationKey}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          ))}
        </>
        )}
      </ListItem.Accordion>
    </View> */}
 
      

    <TouchableOpacity onPress={toggleDropdown}>
      <View style={styles.rowLocation}>
      <Text style={{fontWeight:"800"}}>Locations </Text>
      <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/down-arrow.png")}
        />
      </View>
       
      </TouchableOpacity>
      {showDropdown && (
         <View style={styles.dropdown}>
         {Object.keys(locations).map((locationKey) => ( // Loop through location keys
           <TouchableOpacity 
           key={locationKey} 
           onPress={() => {
             focusOnLocation(locationKey);
             toggleDropdown(); // Close the dropdown after item is pressed
           }}
         >
             <Text>Focus on {locationKey}</Text>
           </TouchableOpacity>
         ))}
       </View>
      )}
            {/* <TouchableOpacity onPress={focousMap}>
                    <View>
                        <Text>Focous</Text>
                    </View>
                </TouchableOpacity> */}
                 <View>
   
    
  </View>
        <View style={styles.mapCard}>
        <MapView style={styles.map} provider={PROVIDER_GOOGLE }
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
            latitude: 6.903971020603182,
            longitude: 79.95515273932618,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}
        
        ref={mapRef}>
            {location && (
            <Marker coordinate={location}>
              <Callout>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 19 }}>Your Location</Text>
                </View>
              </Callout>
            </Marker>
          )}
            {markers.map((marker,index)=>(
                <Marker key={index} coordinate={marker}>
                    <Callout>
                        <View style={{padding:10}}>
                            <Text style={{fontSize:19}}>{marker.name}</Text>
                        </View>
                    </Callout>

                 </Marker>
            ))}
        </MapView>
        
        </View>
        
    
  </View>
  
    
  
  )
}

export default Map
const styles = StyleSheet.create({
  container: {
    width:"auto",
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  mapCard: {
    
    overflow: "hidden",
    height: "82%",
    width: "100%", 
    backgroundColor: '#FFFFFF', 
    borderRadius:30,    
  },
  
  map: {
    width: '100%',
    height: '100%',
    borderRadius:50,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    width:"100%",
  },
  rowLocation: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom:10,
    left:5,
    width:"100%",
  },
  dropdown: {
    position: 'absolute',
    top: 150, // Adjust this value as per your design
    left:17, // Adjust this value as per your design
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
    zIndex: 10,
  },
  dropdownButton: {
    padding: 10,
  },
  imageBackground: {
    top:2,
    height: 20,
    width: 20,
  },
});