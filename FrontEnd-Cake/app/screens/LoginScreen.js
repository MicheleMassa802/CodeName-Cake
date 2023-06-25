import { React, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { configureShopStats } from '../../config/shopStatsUtil';
import Slider from '@react-native-community/slider';
import font_styles from '../../config/generics';
import colors from '../../config/colors';

import BASE_URL from '../../config/network';

function LoginScreen(props) {


    const opt1 = 'With Email';
    const opt2 = 'With Username';

    const [username, setUsername] = useState ('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginOption, setLoginOption] = useState(opt1);
    

    const functionStyles = StyleSheet.create({
        button: {
            backgroundColor: colors.primary_default,  // used to be colorway
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const login = () => {
        console.log(`Logging in with info: ${username}, ${email}, ${password}`);
        
        // check for empty fields
        if ((username === '' && email === '') || password === '') {
            alert('Please fill out all fields before logging in!');
            return;
        }
        
        // otw, make fetch calls to login the user

        const endpoint = "auth/authenticate"

        // config vars

        const headers = {
            // Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        };

        const body = {
            username : username,
            email : email,
            password : password
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        // fetch call
        fetch(BASE_URL + endpoint, options)
            .then(response => {
                if (response.status == 403){
                    alert("Your login information seems to be incorrect, please re-check and resubmit");
                    return;
                }
                return response.json()
            })
            .then(async data => {

                console.log(`Successfuly logged in to user: ${JSON.stringify(data)}`);

                // configure the shop stats
                try {
                    await configureShopStats(data.token, data.userId);
                } catch (error) {
                    console.log(`Error configuring shop stats: ${error}`);
                    return;
                }

                props.navigation.popToTop();
                
                props.navigation.push("HomeScreen", {
                    userId: data.userId,
                    shopId: data.shopId,
                    shopName: data.shopName,
                    colorway: colors.getColorByColorwayNumber(data.colorway),
                    token: data.token
                });

            })
            .catch(error => {
                console.log(`Error logging in: ${error}`);
                return;
        });       
    }

    return (
        <View style={styles.container}>
            
            <Text numberOfLines={3} style={styles.instruction}> Fill out the following details to log into your existing account with us! </Text>
            
            <View style={styles.slideDiv}>
                <Text numberOfLines={2} style={font_styles.bodyCenter}>Slide to login using your account's {'\n'} email or username</Text>
                <View style={styles.subDiv}>

                    <Text style={font_styles.label}>{loginOption}</Text>
                    
                    <Slider
                        style = {styles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        step={1}
                        onValueChange={(value) => value === 0 ? setLoginOption(opt1) : setLoginOption(opt2)}
                        // if value == 0 then you are using the email to login, otw the username
                        minimumTrackTintColor={colors.primary_default}
                        maximumTrackTintColor={colors.darker_secondary}
                        thumbTintColor={colors.primary_default}
                    />
                </View>
            </View>
            
            { loginOption === opt1 && <View style= {styles.subDiv}>
                <Text style={font_styles.label}>Email</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View> }

            { loginOption === opt2 && <View style={styles.subDiv}>
                <Text style={font_styles.label}>Username</Text>
                <TextInput
                    style={font_styles.input}
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View> }

            
            
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

            <TouchableOpacity style = {functionStyles.button} onPress={login}>  
                <Text style={font_styles.subtitle}> Finish Login </Text>
            </TouchableOpacity>

        
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

    slider: {
        width: 50,
        height: 40,
    },

    subDiv: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    slideDiv: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        // borderWidth: 1,
        // borderColor: colors.primary_default,
    },

});

export default LoginScreen;