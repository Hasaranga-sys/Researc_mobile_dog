import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    Keyboard,
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

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { useNavigation } from "@react-navigation/native";
  import {auth} from '../firebase/firebase-config'



const Signup = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');

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
        if(email && password && firstName && lastName && address){
          try {
           await createUserWithEmailAndPassword(auth,email,password)
           console.log("Log");
           const registerCollectionRef = collection(db,'Registerd_User')
           console.log("First name",firstName);
           console.log("user emaik", user.email)
           await setDoc(doc(registerCollectionRef),{
            firstName:firstName,
            lastName:lastName,
            address,
            email:email
           })
           console.log("Data stored successfully in Firestore!");
          } catch (error) {
            console.log("Error storing data in Firestore:",error.message);
          }
        }
    }
  
    const handleChangeText = (user, value) => {
      setUser((prevState) => ({ ...prevState, [user]: value }));
    };
  
    // const signin = async () => {
    //   const auth = getAuth();
    //   await createUserWithEmailAndPassword(auth, user.email, user.password)
    //     .then(() => {
    //       setDoc(doc(db, "RegisteredUser", auth.currentUser.uid), {
    //         uid: auth.currentUser.uid,
    //         role: "Freelancer",
    //         email: user.email,
    //         username: user.username,
    //       });
    //       // setDoc(doc(db, "staff", auth.currentUser.uid), {
    //       //   staff_service_id: staff.staff_service_id,
    //       //   staff_name: staff.staff_name,
    //       //   staff_deparment: data[selected].value,
    //       //   staff_phone: staff.staff_phone,
    //       //   uid: auth.currentUser.uid,
    //       //   role: "staff",
    //       //   email: staff.email,
    //       //   username: staff.username,
    //       // });
    //     })
    //     .catch((error) => {
    //       const errorCode = error.code;
    //       const errorMessage = error.message;
    //       alert(errorCode, errorMessage);
    //     });
  
    //   ToastAndroid.show(
    //     user.username + " Request sent successfully!",
    //     ToastAndroid.SHORT
    //   );
    // };
  return (
    <ScrollView style={styles.main_container}>
    <View style={{ marginBottom: 30 }}>
      <Text style={styles.header_text}>Create an Account</Text>
    </View>

    <Text style={styles.input_lable}>First Name</Text>
    <TextInput
      style={styles.input_text}
      placeholder="Enter First name"
      value={firstName}
      onChangeText={value=>setFirstName(value)}
    ></TextInput>

    <Text style={styles.input_lable}>last Name</Text>
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
  </ScrollView>
  )
}

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

export default Signup