import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BACKEND } from "@env";

const Userlogin = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");

    const navigation = useNavigation();

    const handleSignup = () => {
        if (
          !name ||
          !email ||

          !password ||
          password !== confirmPassword ||
          !birthdate ||
          !gender
        ) {
          Alert.alert("항목을 다시 확인해주세요.");
          return;
        }
        storeUser();
      };

    const emailSignup = ()=> {
        // 이메일 중복체크, 백엔드에서 체크
    };
    const storeUser = async() => {
      try {
        console.log("birth : ", birthdate);
        const response = await axios.post(BACKEND+`:8000/account/kakao/callback/`/*BACKEND+':8000/account/kakao/callback/' BACKEND+`:8000/account/kakao/callback/`*/, {
          data:{
            email: email,
            password: password,
            name: name,
            birth: birthdate,
            gender: gender
          }
        });
        console.log(response.status);
        if (response.status === 201) {
          Alert.alert(
            "회원가입",
            "회원가입이 완료되었습니다!",
            [
              {
                text: "확인",
                onPress: () => navigation.navigate("Signin") // Signin 화면으로 이동
              }
            ],
            { cancelable: false }
          );
          
        }
      }
      catch (error) {
        Alert.alert(error+"회원가입을 할 수 없습니다.");
      }
    };
    /*
    const Passwordcheck = ()=> {
        if (password !== confirmPassword) {
            Alert.alert("비밀번호가 일치하지 않습니다.");
            return;
        }
    };
    */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS는 padding, Android는 height 설정
    >
      <ScrollView contentContainerStyle={Styles.container}>      
      <Text style={Styles.HomeText}>Create Account</Text>

      {/* name 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      {/* gender 입력 공간 */}
      <View style={Styles.genderButtonContainer}>
        <TouchableOpacity
          style={[
            Styles.genderButton,
            gender === "M" ? Styles.selectedGender : null,
          ]}
          onPress={() => setGender("M")}
        >
          <Text style={Styles.genderButtonText}>남</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            Styles.genderButton,
            gender === "F" ? Styles.selectedGender : null,
          ]}
          onPress={() => setGender("F")}
        >
          <Text style={Styles.genderButtonText}>여</Text>
        </TouchableOpacity>
      </View>
      
      {/* email 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {/* Password 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry // 비밀번호 입력 시 텍스트 감춤
      />

      {/* Password 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry // 비밀번호 입력 시 텍스트 감춤
      />

      {/* birthdate 입력 공간 */}
      <TextInput
        style={Styles.input}
        placeholder="YYYY-MM-DD"
        value={birthdate}
        onChangeText={(text) => setBirthdate(text)}
      />
      
      <TouchableOpacity
        onPress={handleSignup}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>확 인</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
    
  )
}

export default Userlogin ;

const Styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: "#EAF2FF",
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    
  },
  NextBottom: {
    backgroundColor: "#A9C3D0",
    padding: 10,
    marginTop: "20%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: 'white',
    textAlign: "center",
  },
  genderButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 버튼 사이에 여백을 균등하게 배치
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginHorizontal: 10,
    width: "40%"
  },
  selectedGender: {
    backgroundColor: '#EAF2FF', // 선택된 버튼의 배경색
  },
  genderButtonText: {
    fontSize: 15,
    textAlign: "center",
  },
})