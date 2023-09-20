import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Platform, Button } from "react-native";
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND } from "@env";

const UploadScreen = ({route, navigation}) => {
  const { personId } = route.params;
  const { listItems } = route.params;
  const [currentItems, setCurrentItems] = useState(listItems || []);
  const [video, setVideo] = useState(null);
  const [response, setResponse] = useState("");
  const [imageFile, setImageFile] = useState("");
  //const navigation = useNavigation();

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
  
      // result.uri에 선택한 동영상 파일의 경로가 포함됩니다.
      console.log('result: ', result[0].uri);
      console.log('Video URI:', result.uri);
      setVideo(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // 사용자가 취소한 경우
      } else {
        throw err;
      }
    }
    // const result = await ImagePicker.launchImageLibrary({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   allowsEditing: true,
    //   quality: 1,
    //   aspect: [1,1]
    // });

    // setVideo(result.assets[0]);
  };
  const onUploadVideo = async () => {
    if (!video) return;
    console.log("onUploadVideo 함수 실행");
    // const uriParts = video.uri.split("/");
    // const filename = uriParts[uriParts.length - 1];
    console.log("item id : ", currentItems[currentItems.length - 1]);
    const filename = `c${personId}_r${currentItems[currentItems.length - 1].id + 1}.mp4`;
    console.log("비디오 이름 : ", filename);
    const formData = new FormData();
    formData.append('video', {
      uri: video.uri,
      type: 'video/mp4',
      name: filename,
    });
    formData.append('counselee_id', personId);
    console.log(video.uri);
    console.log("formData",formData);
    await AsyncStorage.getItem('access', (err, result) => {
      token = result;
    });
    console.log("acceess 토큰 : ", token);
    try {
      const response = await axios.post(BACKEND+`:8000/result/`/*BACKEND+':8000/result/' BACKEND+`:8000/result/`*/, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        transformRequest: (data, headers) => {
          return data;
        },
      });
      console.log('Video uploaded successfully!', response.data.id);
      const item = {
        id: response.data.id,
        counselee: response.data.counselee,
        date: response.data.date,
        video: response.data.video
      };
      console.log("item : ", item);
      
      setCurrentItems((prevList) => [...prevList, item]);
      console.log("UploadScreen currentItems : ", [...currentItems, item]);
      navigation.navigate("Screen7", {personId: personId, listItems: [...currentItems, item]});
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

    return (
      <View style={styles.container}>
        <Button title="동영상 선택" onPress={pickVideo} style={styles.button}/>
          <View>
          
            <Image
              source={video ? { uri: video.uri } : 0}
              style={{width:300, height:300, marginTop:20}}
            />

            <TouchableOpacity
              style={{
                backgroundColor: "#4287f5",
                padding: 12,
                borderRadius: 8,
                marginTop: 20,
                marginLeft: 60,
                marginRight: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => onUploadVideo()}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                동영상 업로드
              </Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  };
//};
const styles = StyleSheet.create({
  img: {
    height: 300,
    width: 300,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  button: {
    backgroundColor: "#4287f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom:20,
    marginLeft: 60,
    marginRight: 60,
  }
});

export default UploadScreen;

// const UploadScreen = () => {
//   const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
//   const [video, setVideo] = useState(null);
//   const navigation = useNavigation();

//   const pickVideo = async () => {
//     console.log("pickVideo 함수 실행");
//       // const result = await ImagePicker.launchImageLibraryAsync({
//       //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       //   allowsEditing: false,
//       //   quality: 1,
//       //   aspect: [1,1]
//       // });
//       const result = await DocumentPicker.getDocumentAsync({
//         type: 'video/*', // 동영상 파일만 선택
//       });
//       // if (result.canceled) {
//       //   return null;
//       // }
//       //console.log(result.canceled);
//       setVideo(result);
    
//   };

//   const handleUpload = async () => {
//     if (!video) return;
//     console.log("handleUpload 함수 실행");
//     //const uriParts = video.uri.split("/");
//     //const filename = uriParts[uriParts.length - 1];
//     const formData = new FormData();
//     formData.append('video', {
//       uri: video.uri,
//       type: 'video/mp4',
//       name: 'video.mp4',
//     });
//     console.log(video.uri);
//     console.log("formData",formData);
//     await AsyncStorage.getItem('access', (err, result) => {
//       token = result;
//     });
//     console.log("acceess 토큰 : ", token);
//     try {
//       const response = await axios.post(`${BACKEND}:8000/video/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       console.log('Video uploaded successfully!', response);
//       navigation.navigate("MainScreen");
//     } catch (error) {
//       console.error('Error uploading video:', error);
//     }
//   };


//     /*

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log("User cancelled video picker");
//       } else if (response.error) {
//         console.log("ImagePicker Error: ", response.error);
//       } else {
//         setSelectedVideo(response.uri);
//       }
//     });
//   };*/

//     return (
//       <View style={styles.container}>
//         <Button title="Pick a Video" onPress={pickVideo} />
//         {video && (
//         <View>
//           <Image
//               source={{ uri: video.uri }}
//               style={styles.img}
//             />
//           <Button title="Upload Video" onPress={handleUpload} />
//           <Image source={{ uri: video.uri }} style={{ width: 300, height: 300 }} />
//         </View>
//         )}
//       </View>
//     //   <View>
//     //   <Button title="Pick a Video" onPress={pickVideo} />
//     //   {video && (
//     //     <View>
//     //       <VideoThumbnails.VideoThumbnails
//     //         videoURI={video.uri}
//     //         onComplete={thumbnail => {
//     //           console.log('Thumbnail generated:', thumbnail.uri);
//     //         }}
//     //       />
//     //       <Button title="Upload Video" onPress={handleUpload} />
//     //       <Image source={{ uri: video.uri }} style={{ width: 300, height: 300 }} />
//     //     </View>
//     //   )}
//     // </View>
//       // <SafeAreaView style={{ backgroundColor: "#112123" }}>
//       //   <View style={styles.container}>
//       //       <Video
//       //         source={{ uri: "video url" }}
//       //         style={styles.fullScreen}
//       //         paused={false} // 재생/중지 여부
//       //         resizeMode={"cover"} // 프레임이 비디오 크기와 일치하지 않을 때 비디오 크기를 조정하는 방법을 결정합니다. cover : 비디오의 크기를 유지하면서 최대한 맞게
//       //         onLoad={e => console.log(e)} // 미디어가 로드되고 재생할 준비가 되면 호출되는 콜백 함수입니다.
//       //         repeat={true} // video가 끝나면 다시 재생할 지 여부
//       //         onAnimatedValueUpdate={() => {}}
//       //       />
//       //     </View>
//       //   <ScrollView>
          
//       //     <View>
//       //       <Image
//       //         source={response ? { uri: response.assets[0].uri } : 0}
//       //         style={styles.img}
//       //       />

//       //       <TouchableOpacity
//       //         style={{
//       //           backgroundColor: "#4287f5",
//       //           padding: 12,
//       //           borderRadius: 8,
//       //           marginTop: 20,
//       //           marginLeft: 60,
//       //           marginRight: 60,
//       //           alignItems: "center",
//       //           justifyContent: "center",
//       //         }}
//       //         onPress={() => onSelectImage()}
//       //       >
//       //         <Text style={{ color: "white", fontSize: 18 }}>
//       //           이미지 추가하기
//       //         </Text>
//       //       </TouchableOpacity>
//       //     </View>
//       //   </ScrollView>
//       // </SafeAreaView>
//     );
// };
// const styles = StyleSheet.create({
//   img: {
//     height: 120,
//     width: 120,
//     marginTop: 20,
//     marginBottom: 20,
//     alignSelf: "center",
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white"
//   },
//   fullScreen: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0
//   }
// });

// export default UploadScreen;
