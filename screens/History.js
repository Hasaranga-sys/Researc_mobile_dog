
import { ScrollView, StyleSheet, Text, View, FlatList,TouchableOpacity,Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {

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
    useEffect(() => {
        const fetchBookings = async () => {
          try {
            const token = await AsyncStorage.getItem('authToken'); // Retrieve the JWT token from AsyncStorage or any other storage mechanism
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            // const response = await axiosInstance.post('http://192.168.43.172:6000/api/bookings/get-bookings-by-user-id', {}, { headers });
            setData(response.data.data);
          } catch (error) {
            console.log(error);
          }
        };
      
        fetchBookings();
      }, []);
  
        
  
  
        const renderItem = ({ item }) => (
          
          <View style={{padding:10,borderWidth:2, borderColor:"#000",margin:10, borderRadius:10}}>
            <View style={styles.row}>
                <Text>Image 1</Text>
                <Text>Image 2</Text>
                <Text>Image 3</Text>

            </View>
            <View>
                <Text>Disease :</Text>
                <Text>Prediction :</Text>


            </View>
          </View>
        
      );
  return (
    <View style={styles.container}>
    <View style={styles.row}>
     <Text style={{left:12, marginTop:50,marginBottom:20, margin:0, fontSize:30,fontWeight:"900"}}>History</Text>
    </View>


    {/* <View style={styles.box1}>
      <Text style={styles.boxTitle}>Booking List</Text>
    </View> */}

  <ScrollView> 
    <FlatList
    style={styles.box}
          data={data}
          renderItem={renderItem}
          // keyExtractor={(item) => item.id.toString()}
          keyExtractor={item => item._id}
      /> 
  </ScrollView>
  </View>
  )
}

export default History
const styles = StyleSheet.create({
    container:{padding:5},

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        width:"100%",
        
      },
    box: {
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
      
    },
    box1:{
      width: '98%',
      marginLeft:3,
      borderBottomLeftRadius:30,
      borderBottomRightRadius:30,
      height: 100,
      backgroundColor: '#90B77D',
      justifyContent:'center',
      alignContent:'center'
  
    },
    boxTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginLeft:136
      
    },
  
  })