import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import { useFocusEffect } from '@react-navigation/native';

function WelcomeScreen(props) {

    useFocusEffect(
        React.useCallback(() => {
            resetGlobalState();
        }, [])
    );

    const resetGlobalState = () => {
        console.log("Resetting global state");
        // once user gets to welcome screen, reset global state
        global.user = null;
        global.token = null;
    }

    return (
        <View style={styles.container}>
            <View style = {styles.top}>
                <View style={styles.innerTop} >
                    <Text style={font_styles.title}> Welcome To Cake!</Text>
                    <Text numberOfLines={3} style={font_styles.subtitle}> Please select how you want {"\n"} to proceed through the {"\n"} buttons below</Text>
                </View>
            </View>


            <TouchableOpacity style = {styles.middle} onPress={() => props.navigation.push("RegisterScreen")}>  
                <Text style={font_styles.subtitle}> Register </Text>
            </TouchableOpacity>


            <TouchableOpacity style = {styles.bottom} onPress={() => props.navigation.push("LoginScreen")}>  
                <Text style={font_styles.subtitle}> Or Login! </Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    top: {
        flex: 8,
        // backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,

    },
    middle: {
        backgroundColor: colors.darker_secondary,
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        backgroundColor: colors.primary_default,
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerTop: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    }
  });


export default WelcomeScreen;
