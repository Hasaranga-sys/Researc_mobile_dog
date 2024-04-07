import { ScrollView, StyleSheet, Text, View, ImageBackground,TouchableOpacity,Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";



const ViewHistory = ({route}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  const handleButtonPress = (index) => {
    setSelectedIndex(index);
    scrollViewRef.current.scrollTo({ x: index * 340, animated: true });
  };
    // console.log("PARAMETRS PASSED", route.params);
    const {selectedItem} = route.params;
    const { clz, confidence, classs } = selectedItem.results;

    console.log("SCSxxx",selectedItem.results.control.results.classs);
    const dataArray = selectedItem.results.control;
  return (
    
    
    <View style={styles.container}>  
    
    <View style={styles.row}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <ImageBackground  style={{height:30,width:30,top:59,right:33}} source={require("../assets/left.png")}></ImageBackground>
      </TouchableOpacity>
    <Text style={{ marginTop:50,marginBottom:20,fontSize:30,fontWeight:"900",right:45}}>Result Details</Text>
   </View>  
   <ScrollView style={{ backgroundColor: "##ccc9e6", flex: 1, paddingHorizontal: 10 }} >  
    <View style={styles.cardh}>  

    <ScrollView 
     horizontal={true}
     style={styles.scrollView}
     ref={scrollViewRef}
     showsHorizontalScrollIndicator={false}
     pagingEnabled={true}>

      <Image source={{ uri: selectedItem.file1 }} style={styles.image} />
      <Image source={{ uri: selectedItem.file2 }}  style={styles.image} />
      <Image source={{ uri: selectedItem.file3 }}  style={styles.image} />
    </ScrollView>
    <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleButtonPress(0)} style={styles.button}>
         <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonPress(1)} style={styles.button}>
        <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleButtonPress(2)} style={styles.button}>
        <Text>3</Text>
        </TouchableOpacity>
      </View>
   

   
    </View>

    
    <View style={styles.cardh}>
    <Text style={{alignSelf:"center",marginTop:3, fontSize:20,fontWeight:"600"}}>Details</Text>

        <Text>Age : {selectedItem.results.age}</Text>

        <Text>Class: {selectedItem.results.control.results.classs}</Text>

        <Text>Weight: {selectedItem.results.control.results.weight}</Text>

        <Text style={{ fontWeight: 'bold' }}>Control Steps:</Text>
        <Text>
        {dataArray.results.control.map((step, index) => (
          <View key={index}>
            <Text>{index + 1}. {step}</Text>
          </View>         
          ))}
        </Text>

        <Text style={{ fontWeight: 'bold' }}>Medicines:</Text>
        <Text>
        {dataArray.results.medicines.map((step, index) => (
          <View style={{width:350}} key={index}>
            <Text>{index + 1}. {step}</Text>
          </View>         
          ))}
        </Text>
        

      </View>
    
    
    <View style={styles.container}>
      {/* Your existing code */}
      
    </View>
   

    {/* <View style={styles.cardh}>      
      <Text style={{width:220, fontWeight:"600", fontSize:20}}>Results</Text>
      <Text style={{marginTop:10}}>Prediction Results          : {result.prediction}</Text>
      <Text>Confidance percentage  : {result.percentage}</Text>
    </View> */}
    <View  style={styles.box1}>
      {/* <Image source={{ uri: item.file1 }} style={{ width: 100, height: 100 }} />
      <Image source={{ uri: item.file2 }} style={{ width: 100, height: 100 }} />
      <Image source={{ uri: item.file3 }} style={{ width: 100, height: 100 }} /> */}
          {/* <Text>Result Percentage: {item.result.percentage}</Text>
          <Text>Result Prediction: {item.result.prediction}</Text> */}
          {/* <Text>Timestamp: {item.timestamp.toDate().toString()}</Text> */}
          {/* <Text>User Email: {item.user.email}</Text>
          <Text>User UID: {item.user.uid}</Text> */}
    </View>
  
    </ScrollView>
  </View>

    
    

//     <View>
//         <Text>Hello</Text>
//     {/* Display details of the selected item */}
//     <Image source={{uri: selectedItem.file1}} style={{ width: 130, height: 130 }}/>
//     <Image source={{uri: selectedItem.file2}} style={{ width: 130, height: 130 }}/>
//     <Image source={{uri: selectedItem.file3}} />
//     {/* Add more details as needed */}
//   </View>
  )
}

export default ViewHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
      },
      image: {
        width: 340,
        height: 340,
       
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
      },
      button: {
        width: 40,
        height: 40,
        backgroundColor: 'lightgrey',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
    
     headerRow:{
      flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        width:"100%",
     },
           
      cardh: {
        right:7,        
   
        overflow: "hidden",
        margin: 9,
       
      
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
     
    });