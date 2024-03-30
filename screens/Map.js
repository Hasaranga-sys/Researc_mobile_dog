
import { ScrollView, StyleSheet, Text, View, FlatList,TouchableOpacity,Image,Alert } from 'react-native'
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
import * as Permissions from 'expo-location';

const INITIAL_REGION = {
    latitude:37.33,
    longitude: -122,
    latitudeDelta:2,
    longitudeDelta:2,
};

const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const mapRef = useRef(null);
    const navigation = useNavigation();

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



    const focousMap = () =>{
        const GreenBayStadium = {
            latitude: 6.88690105808959,
			longitude: 79.90134650086635,
			latitudeDelta: 0.1,
			longitudeDelta: 0.1}
            mapRef.current.animateToRegion(GreenBayStadium);
    };

    const onRegionChange = (region) => {
        console.log(region);
    };       

    const onMarkerSelected = (marker) => {
        Alert.alert(marker.name)
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
            <TouchableOpacity onPress={focousMap}>
                    <View>
                        <Text>Focous</Text>
                    </View>
                </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  mapCard: {
    
    overflow: "hidden",
    height: 678,
    width: "100%", // Set your desired width
    backgroundColor: '#e1e4ed', // Set your desired background color
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
});