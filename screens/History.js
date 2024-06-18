
import { useNavigation } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance

const History = () => {

  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const auths = getAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
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
    setLoading(false);
    console.log("DATASET",data);
  };
 


      const fetchFromDatabase = async(user) =>{
        try {
          // console.log("Start try");
          // const predictionsCollectionRef = collection(db,"Original_Predic");
          // console.log("Collection");
          // const snapshot = await getDocs(predictionsCollectionRef);

          //new from off doc
          console.log("Strt new");
          // const userMail = user.email;
          console.log("USER EMAIL",auths.currentUser.email);
          setLoading(true);
          const allData = query(collection(db,"Original_Predic"),where("user.email", "==" , auths.currentUser.email),where("results.active", "==", "Yes"))
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
          // result: {
          //   percentage: doc.data().result.percentage,
          //   prediction: doc.data().result.prediction,
          // },
          results: {
            age: doc.data().results.age,
            control:doc.data()
          },
          timestamp: doc.data().timestamp,
          user: {
            email: doc.data().user.email,
          },
              })
            })
            console.log('Data from Firestore:', data);
            return data;
          }

        } catch (error) {
          console.error('Error fetching data from Firestore:', error);
          setLoading(false);
        return [];
        }
      }
  

      const renderItem = ({ item }) => (

        <View style={styles.container}>      
        <View style={styles.cardh}>  
        <View style={styles.row}>
        <TouchableOpacity >
          <Text>{item.timestamp}</Text>
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
        <View  style={styles.box1}>
          {/* <Image source={{ uri: item.file1 }} style={{ width: 100, height: 100 }} />
          <Image source={{ uri: item.file2 }} style={{ width: 100, height: 100 }} />
          <Image source={{ uri: item.file3 }} style={{ width: 100, height: 100 }} /> */}
              {/* <Text>Result Percentage: {item.result.percentage}</Text>
              <Text>Result Prediction: {item.result.prediction}</Text> */}
              <Text>Timestamp: {item.timestamp.toDate().toString()}</Text>
              {/* <Text>User Email: {item.user.email}</Text>
              <Text>User UID: {item.user.uid}</Text> */}
        </View>
      </View>

        
      );

  const handleHistoryClick = (item) => {
    // Navigate to Details component and pass necessary data as params
    navigation.navigate('ViewHistory', {selectedItem: item});
  };
  
        
  
  
  return (
    
    <View style={styles.container}>
     
      <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <ImageBackground  style={{height:30,width:30,top:59,right:45}} source={require("../assets/left.png")}></ImageBackground>
      </TouchableOpacity>
    
    <Text style={{right:75, marginTop:54,marginBottom:20, margin:0, fontSize:30,fontWeight:"900"}}>History</Text>
   </View>

   <View>
          <View style={{height:"90%"}} >

         {loading ?(<ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center', top:50 }} size="large" color="#0000ff" />)
         : data == null || data.length === 0 ?
         (<View style={styles.containerImage}>
           <ImageBackground style={styles.imageBackground} source={require("../assets/empty-cart.png")}></ImageBackground>
          <Text style={styles.dataCheckText}>No data Available !!!</Text>
          </View>)
         :( <FlatList
                  data={data.sort((a,b)=>b.timestamp.seconds - a.timestamp.seconds)}
                  keyExtractor={(item, index) => index.toString()}
                  
                  renderItem={({ item,index }) => (
                    <TouchableOpacity onPress={()=>handleHistoryClick(item)}>
                    <View style={styles.cardh}>
                    <View style={{ marginBottom: 10 }}>
                    <Text style={{fontWeight:'bold'}}>{index + 1} : {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</Text>
                      <View style={{marginTop:10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <Image source={{ uri: item.file1 }} style={{ width: 70, height: 70 }} />
                        <Image source={{ uri: item.file2 }} style={{ width: 70, height: 70 }} />
                        <Image source={{ uri: item.file3 }} style={{ width: 70, height: 70 }} />
                      </View>
                    </View>
                    </View>
                    </TouchableOpacity>
                  )}
              />)}
          </View>
    
    </View>
   

  </View>
  
  )
}

export default History
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
      overflow: "hidden",
      margin: 13,
      top: 0,
      left:8,
      justifyContent: 'center',
      width: 350,
  
      backgroundColor: '#e1e4ed',
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
      width: "130%", 
      height: 170,
      backgroundColor: '#e1e4ed',
      padding: 16,
      borderRadius: 25,
      marginTop: 10,
      alignItems:"center",
      justifyContent:"center"
    },
    incard: {
      width: "100%", 
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
    containerImage: {
      justifyContent: 'center',
      alignItems: 'center', 
    },
    imageBackground: {
      left:40,
      width: '80%', 
      height: '70%', 
    },
    dataCheckText:{
      fontSize:17,fontWeight:"400"
    }
  });