import {
    Text,
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
  } from "react-native";
  import React, { Component } from "react";
  import { useNavigation } from "@react-navigation/native";
  import Svg, { Path } from "react-native-svg";
  import Lightbox from "react-native-lightbox";

const LandingPage = () => {
    const navigation = useNavigation();
  return (
    <View
    style={{
      backgroundColor: "#64B5F6",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View>
        <Image  style={{
            height: Dimensions.get("screen").height,
            resizeMode: "contain",
            width: Dimensions.get("screen").width * 2,
            position: "relative",
            top: 0,
            flex: 1,
          }}
          source={require("../assets/25872124_doctor_consultation_03-removebg.png")}/>
    </View>
    <View style={styles.bottom}>
    <View style={styles.box}>
    <Svg
            height={350}
            width={Dimensions.get("screen").width}
            viewBox="0 0 1440 320"
            style={styles.bottomWavy}
          >
            <Path
              fill="#2196F3"
              fill-opacity="1"
              d="M0,96L80,85.3C160,75,320,53,480,74.7C640,96,800,160,960,176C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </Svg>
          <View>
            <Text  style={{
                // textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                color: "white",
                paddingHorizontal: 30,
              }}>
                Doctor' Helpline Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor Incididunt ut labore et
              dolore magna.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 20,
              // width: "70%",
              backgroundColor: "#fff",
              paddingVertical: 10,
              marginHorizontal: 30,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#2196F3" }}
            >
              Get Started
            </Text>
          </TouchableOpacity>



    </View>
    </View>

  </View>
  )
}

export default LandingPage

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    top: {},
    bottom: {
      position: "absolute",
      width: Dimensions.get("screen").width,
      bottom: 0,
    },
    box: {
      backgroundColor: "#2196F3",
      height: 170,
    },
    bottomWavy: {
      position: "absolute",
      bottom: 20,
    },
  });