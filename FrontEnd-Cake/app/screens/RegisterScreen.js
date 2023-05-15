import {React, useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import font_styles from '../../config/generics';
import colors from '../../config/colors';

const COLORWAY_OPTIONS = ['#e0c4f3', '#ccccff', '#6699ff', '#669999', '#fff2cc'];

function RegisterScreen(props) {
    
    const [username, setUsername] = useState ('');
    const [email, setEmail] = useState('');
    const [shopName, setShopName] = useState('');
    const [colorway, setColorway] = useState('#e0c4f3');  // by default
    const [password, setPassword] = useState('');
    
    const functionStyles = StyleSheet.create({
        button: {
            backgroundColor: colorway,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    // console.log("RegisterScreen: username = " + username);
    // console.log("RegisterScreen: email = " + email);
    // console.log("RegisterScreen: shopName = " + shopName);
    // console.log("RegisterScreen: colorway = " + colorway);
    // console.log("RegisterScreen: password = " + password);

    return (
        <View style={styles.container}>
            
            <Text numberOfLines={3} style={styles.instruction}> Fill out the following details to register your new account with us! </Text>

            <View style={styles.subDiv}>
                <Text style={font_styles.label}>Username</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            <View style= {styles.subDiv}>
                <Text style={font_styles.label}>Email</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            
            <View style={styles.subDiv}>
                <Text style={font_styles.label}>Shop Name</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter shop name"
                    value={shopName}
                    onChangeText={setShopName}
                />
            </View>
            
            <View style={styles.subDiv}>
                <Text style={font_styles.label}>Password</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.mcSubDiv}>
                <Text style={font_styles.label}>Colorway</Text>
                {COLORWAY_OPTIONS.map((colorOption) => (
                    <View key={colorOption} style={styles.radioContainer}>
                        <TouchableOpacity onPress={() => setColorway(colorOption)}>
                            <View style={[styles.colorCircle, {backgroundColor: colorOption}]} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style = {functionStyles.button}>
                <TouchableOpacity onPress={() => console.log("Registered")}>  
                    <Text style={font_styles.subtitle}> Finish Registration </Text>
                </TouchableOpacity>
            </View>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',

    },

    instruction: {
        fontSize: 22,
        fontWeight: "bold",
        // fontFamily: "Inconsolata",
        textAlign: "center",
        margin: 20,
    },

    subDiv: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    mcSubDiv: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10,
    },

    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15, // half of the width and height
        borderWidth: 1,
        borderColor: colors.black,
    },
});

export default RegisterScreen;