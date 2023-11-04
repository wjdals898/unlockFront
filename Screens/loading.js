import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const Loading = ({t}) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <ActivityIndicator size = "large" color='#4296FF'/>
                {t===1 ?<Text style={styles.text}> 잠시만 기다려주세요!</Text> : <></>}
            </View> 
        </SafeAreaView>    
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        top:0,
        bottom:0,
        margin: 10,
    },
    text: {
        color: 'black',
        marginTop: 20,
        fontSize: 20,
    },
});

export default Loading;