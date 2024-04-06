import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    Keyboard,
    ImageBackground
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from '../firebase/firebase-config'; // Import your Firebase Firestore instance

  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
  } from "firebase/auth";
  import { useNavigation } from "@react-navigation/native";
  // import {auth} from '../firebase/firebase-config'

 



const Signup = () => {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const auth = getAuth();

    const [user, setUser] = useState({
      username: "",
      email: "",
      password: "",
      firstName: '',
      lastName: '',
      address: '',
    });
    const [isChecked, setChecked] = useState(false);

    const handleSubmit = async ()=>{
        if(email && password && address && firstName && lastName){
          try {
            const userCredential = await createUserWithEmailAndPassword(auth,email, password);
            
            const userData = {
              uid:userCredential.user.uid,
              email:email,
              displayName: displayName,
              address: address,
              firstName: firstName,
              lastName: lastName
          };
          console.log("DATABSE",db);
          console.log("user data",user);

          // await firestore.collection('Registerd_User').doc(userCredential.user.uid).set(userData);
          const registerCollectionRef = collection(db,'Registerd_User');
          await setDoc(doc(registerCollectionRef,userCredential.user.uid),userData);

            console.log('User created successfully!');
                  ToastAndroid.show(
                    user.username + " User Created Succesfully!",
                    ToastAndroid.SHORT
                  );
   
           console.log("Data stored successfully in Firestore!");
          } catch (error) {
            console.log("Error storing data in Firestore:",error.message);
          }
        }
    }
  
    const handleChangeText = (user, value) => {
      setUser((prevState) => ({ ...prevState, [user]: value }));
    };
  

  return (
    <ScrollView style={styles.main_container}>
    <View style={{ marginBottom: 50 }}>
    <Text style={styles.header_text}>Sign Up!!</Text>
    
    <ImageBackground style={{height:200, width:200, left:80,top:20}} source={require("../assets/mother.png")}></ImageBackground>
    </View>
    <View style={styles.cardh}>
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


    <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </View>
      </TouchableOpacity>

    {/* <TouchableOpacity
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
    
  </ScrollView>
  )
}

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

export default Signup