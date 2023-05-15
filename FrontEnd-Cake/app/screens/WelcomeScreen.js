import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';

function WelcomeScreen(props) {

    return (
        <View style={styles.container}>
            <View style = {styles.top}>
                <View style={styles.innerTop} >
                    <Text style={font_styles.title}> Welcome To Cake!</Text>
                    <Text numberOfLines={3} style={font_styles.subtitle}> Please select how you want {"\n"} to proceed through the {"\n"} buttons below</Text>
                </View>
            </View>


            <View style = {styles.middle}>
                <TouchableOpacity onPress={() => console.log("Register")}>  
                    <Text style={font_styles.subtitle}> Register </Text>
                </TouchableOpacity>
            </View>


            <View style = {styles.bottom}>
                <TouchableOpacity onPress={() => console.log("Login")}>  
                    <Text style={font_styles.subtitle}> Or Login! </Text>
                </TouchableOpacity>
            </View>
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
