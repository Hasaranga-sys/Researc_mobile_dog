import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from './screens/Home';
// import ImagePicker from 'react-native-image-picker';
// import { View, Text, TouchableOpacity, Image, StyleSheet ,ImagePickerResult } from 'react-native';
import { StyleSheet,} from 'react-native';
import React, { useState } from 'react';
import { View, Text, Button, ImagePickerResult, Platform,Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Login from './screens/Login';
import LandingPage from './screens/LandingPage';
import Home from './screens/Home';
import Scan from './screens/Scan';
import History from './screens/History';
import Signup from './screens/Signup';
import useAuth from './firebase/useAuth';
import FileUpload from './screens/FileUpload';
import Map from './screens/Map';

// 
export default function App() {

  // const [image1, setImage1] = useState(null);
  // const [image2, setImage2] = useState(null);
  // const [image3, setImage3] = useState(null);

  // const pickImage = async (setImage) => {
  //   let result: ImagePickerResult;
  //   if (Platform.OS !== 'web') {
  //     result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });
  //   }

  //   if (!result.cancelled) {
  //     setImage(result.uri);
  //   }
  // };

  // const handleUpload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file1', {
  //       uri: image1,
  //       name: 'image1.jpg',
  //       type: 'image/jpg',
  //     });
  //     formData.append('file2', {
  //       uri: image2,
  //       name: 'image2.jpg',
  //       type: 'image/jpg',
  //     });
  //     formData.append('file3', {
  //       uri: image3,
  //       name: 'image3.jpg',
  //       type: 'image/jpg',
  //     });

  //     const response = await axios.post('http://your-flask-backend-ip:5000/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //   }
  // };

  //upload worked start*****************************
  // const [images, setImages] = useState([null, null, null]);

  // const pickImages = async () => {
  //   try {
  //     const results = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: false,
  //       aspect: [4, 4],
  //       quality: 1,
  //       numberOfSelections: 3, // Specify the number of images to select
  //     });

  //     if (!results.canceled) {
  //       setImages([results.uri, results.uri, results.uri]);
  //     }
  //   } catch (error) {
  //     console.error('Error picking images:', error);
  //   }
  // };

  // const handleUpload = async () => {
  //   try {
  //     const formData = new FormData();
  //     images.forEach((uri, index) => {
  //       formData.append(`file${index + 1}`, {
  //         uri : uri,
  //         name: `image${index + 1}.jpg`,
  //         type: 'multipart/form-data',
  //       });
  //       console.log("form data go");
  //     });

  //     const response = await axios.create('http://127.0.0.1:8081/second', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error uploading images:', error);
  //   }
  // };
//*****************************************************************************8 */
  // 3 buttons setup link 
  // https://chat.openai.com/share/45ed832b-d1bf-4220-832a-3b97f5dd0a10
//********************************************************************************8 */
  //upload worked end****************************************

  //seperate 3 buttons 
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  const pickImage = async (setImage) => {
    let result;
    if (Platform.OS !== 'web') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file1', {
        uri: image1,
        name: 'image1.jpg',
        type: 'image/jpg',
      });
      formData.append('file2', {
        uri: image2,
        name: 'image2.jpg',
        type: 'image/jpg',
      });
      formData.append('file3', {
        uri: image3,
        name: 'image3.jpg',
        type: 'image/jpg',
      });

      const response = await axios.post('http://192.168.8.4:8081/second', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };
  // seperate 3 buttons end
  //bard************
  // const [images, setImages] = useState([]);
  // const [error, setError] = useState(null);

  // const pickImages = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //     quantity: 3, // Allow selection of 3 images
  //   });
  
  //   if (!result.canceled) {
  //     setImages(result.assets.map((asset) => asset.uri));
  //   }
  // };

  // const uploadImages = async () => {
  //   try {
  //     const formData = new FormData();
  //     for (const imageUri of images) {
  //       const file = await FileSystem.getInfoAsync(imageUri);
  //       formData.append('images', {
  //         uri: imageUri,
  //         type: file.type,
  //         name: file.name,
  //       });
  //     }
  
  //     // Replace with your actual backend URL
  //     const response = await fetch('http://192.168.106.46:5000/upload', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     const data = await response.json();
  //     // Handle success or error response from the server
  //     console.log(data);
  //   } catch (error) {
  //     setError(error);
  //   }
  // };
  
  // bard end*************


  // const [images, setImages] = useState([]);

  // const handleImageSelect =()=>{
  //   const options ={
  //     title:'Image select',
  //     storageOptions: {
  //       skipbackup:true,
  //       path: 'images',
  //     },}

  //     ImagePicker.launchImageLibraryAsync(options,(response) => {
  //       if(response.didCancel){
  //         console.log('imge canceld');
  //       }else if(response.error){
  //         console.log('Imgage picker error');
  //       }else{
  //         setImages([...images,response]);
  //       }
  //     });
  // }

 

  // const handleImageUpload = async () =>{
  //   try {
  //     const formData = new FormData();

  //     images.forEach((image,index)=>{
  //       formData.append('image${imdex + 1}', {
  //         uri: image.uri,
  //         type: image.type,
  //         name: image.fileName || 'image${index + 1}.jpg',
  //       });
  //     })
  //   } catch (error) {
      
  //   }
  // }
  const Stack = createNativeStackNavigator();
  const {user} = useAuth();

  if(user){
    return (
      //new creation
      <View 
        style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}>
       
          <NavigationContainer>
          <Stack.Navigator>
            {/* <Stack.Screen name="LandingPage" component={LandingPage}  
            options={{ title: "LandingPage",  headerStyle: { backgroundColor: "black" },  headerShadowVisible: false, headerTitleAlign: "center", headerShown: false,}} />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Login",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    /> */}
            
            <Stack.Screen
              name="Home"  component={Home}
                 options={{    title: "Home", headerStyle: { backgroundColor: "#ccc9e6" }, headerShadowVisible: false,  headerTitleAlign: "center", headerShown: false,  }} />
             <Stack.Screen
              name="Scan"  component={Scan}
                 options={{  title: "Scan", headerStyle: { backgroundColor: "#ccc9e6" }, headerShadowVisible: false,  headerTitleAlign: "center",  headerShown: false, }}  />
            
            <Stack.Screen  name="History"  component={History}
               options={{ title: "History", headerStyle: { backgroundColor: "#ccc9e6" }, headerShadowVisible: false,   headerTitleAlign: "center",   headerShown: false, }} />

              <Stack.Screen  name="FileUpload"  component={FileUpload}
               options={{ title: "FileUpload", headerStyle: { backgroundColor: "#ccc9e6" }, headerShadowVisible: false,   headerTitleAlign: "center",   headerShown: false, }} />

              <Stack.Screen  name="Map"  component={Map}
               options={{ title: "Map", headerStyle: { backgroundColor: "#ccc9e6" }, headerShadowVisible: false,   headerTitleAlign: "center",   headerShown: false, }} /> 
          
          </Stack.Navigator>
        </NavigationContainer>
       
  
      </View>
  
  
  
  
  
  
  
  
  
  
  
  
  
      //3 button
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>Upload Images</Text>
    //   <Button title="Pick Image 1" onPress={() => pickImage(setImage1)} />
    //   {image1 && <Image source={{ uri: image1 }} style={{ width: 200, height: 200 }} />}
    //   <Button title="Pick Image 2" onPress={() => pickImage(setImage2)} />
    //   {image2 && <Image source={{ uri: image2 }} style={{ width: 200, height: 200 }} />}
    //   <Button title="Pick Image 3" onPress={() => pickImage(setImage3)} />
    //   {image3 && <Image source={{ uri: image3 }} style={{ width: 200, height: 200 }} />}
    //   <Button title="Upload Images" onPress={handleUpload} />
    // </View>
  
  // upload worked 
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>Upload Images</Text>
      //   <Button title="Select Images" onPress={pickImages} />
      //   {images.map((uri, index) => (
      //     <View key={index}>
      //       {uri && <Image source={{ uri }} style={{ width: 200, height: 200 }} />}
      //     </View>
      //   ))}
      //   <Button title="Upload Images" onPress={handleUpload} />
      // </View>
      // upload worked end 
  
      // bard
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Button title="Pick Images" onPress={pickImages} />
    //   <Button title="Upload Images" onPress={uploadImages} />
    //   {images.map((imageUri, index) => (
    //     <Image key={index} source={{ uri: imageUri }} style={{ width: 100, height: 100, margin: 5 }} />
    //   ))}
    //   {error && <Text>{error.message}</Text>}
    // </View>
      // bard end 
    );
  }else{
    return (
      //new creation
      <View 
        style={{
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}>        
          <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="LandingPage" component={LandingPage}  
            options={{ title: "LandingPage",  headerStyle: { backgroundColor: "black" },  headerShadowVisible: false, headerTitleAlign: "center", headerShown: false,}} />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ title: "Login",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
            
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ title: "Signup",  headerStyle: { backgroundColor: "black" },headerShadowVisible: false,headerTitleAlign: "center", headerShown: false,  }}    />
          </Stack.Navigator>
        </NavigationContainer>               
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1f8",
    alignItems: "center",
    justifyContent: "center",
  },
});
