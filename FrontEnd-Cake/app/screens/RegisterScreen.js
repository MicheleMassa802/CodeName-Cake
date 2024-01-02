import {React, useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { configureShopStats } from '../../config/shopStatsUtil';
import font_styles from '../../config/generics';
import colors from '../../config/colors';

import BASE_URL from '../../config/network';

const COLORWAY_OPTIONS = ['#e0c4f3', '#ccccff', '#6699ff', '#669999', '#fff2cc'];

function RegisterScreen(props) {

    const [username, setUsername] = useState ('');
    const [email, setEmail] = useState('');
    const [shopName, setShopName] = useState('');
    const [colorway, setColorway] = useState('#e0c4f3');  // by default
    const [password, setPassword] = useState('');
    const [shopId, setShopId] = useState(0);  // by default
    
    const functionStyles = StyleSheet.create({
        button: {
            backgroundColor: colorway,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const register = () => {
        // check for empty fields
        if (username === '' || email === '' || shopName === '' || password === '') {
            alert('Please fill out all fields before registering!');
            return;
        }

        // otw, make the fetch calls to register a user
        
        const colorwayIndex = COLORWAY_OPTIONS.indexOf(colorway);

        const shopEndpoint = "shop/addShop"
        const regEndpoint = "auth/register";

        // config vars

        const headers = {
            // Authorization: `Bearer ${bearerToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const shopBody = {
            shopName: shopName,
            colorwaySelection: colorwayIndex
        };

        const shopOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(shopBody)
        };


        // fetch call to add shop
        fetch(BASE_URL + shopEndpoint, shopOptions)
            .then(response => response.text()) // parse response as text
            .then(respShopId => {
                // with the value returned (shopId), set the shopId state
                setShopId(respShopId);

                const regBody = {
                    username: username,
                    email: email,
                    password: password,
                    shopId: respShopId
                };
        
                const regOptions = {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(regBody)
                };
        
                // fetch call to register user
                fetch(BASE_URL + regEndpoint, regOptions)
                    .then(response => response.json()) // parse response as JSON
                    // no reason for it to return a 403 error here
                    .then(async data => {
                    
                        console.log(`Registration successful!`);

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
                        console.log(`Error registering user: ${error}`);
                        return;
                });
            })
            .catch(error => {
                console.log(`Error creating shop: ${error}`);
                return;
        });

    }


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

            <TouchableOpacity style = {functionStyles.button} onPress={register}>  
                <Text style={font_styles.subtitle}> Finish Registration </Text>
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