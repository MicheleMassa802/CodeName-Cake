import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import BASE_URL from '../../config/network';


function AddOrderFurtherDetailsScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;


    // Styles
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            marginVertical: 20,
        },

        titleBar: {
            flex: 0.8,
            backgroundColor: colorway,
            borderBottomWidth: 4,
            borderColor: colors.darker_secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },

        detailSection: {
            flex: 5,
            marginVertical: 20,
            marginHorizontal: 10,
            borderWidth: 2,
        },

        orderInput: {
            marginVertical: 5,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },

        multipleChoice: {
            marginVertical: 5,
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexWrap: 'wrap',
        },

        button: {
            paddingHorizontal: 5,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.black,
        },

        label: {
            fontSize: 15,
            fontWeight: "bold",
            marginVertical: 5, // equivalent to margin: 10px 0px 10px 0px
            // fontFamily: "Inconsolata",
        },

        input: {
            width: '50%',
            borderWidth: 1,
            borderColor: colors.darker_secondary,
            padding: 5,
            fontSize: 15,
            borderRadius: 5,
        },

        addButtonSection: {
            flex: 0.08,
            flexDirection: 'row',
        },

        addDetailButton: {
            flex: 1,
            backgroundColor: colors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: 2,
            borderColor: colors.black,
        },

        finishButton: {
            flex: 0.6,
            backgroundColor: colorway,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            marginTop: 0,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: colors.black,
        },

        detailHeader: {
            flex: 0.2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 5,
        },

        detailHeaderTitle: {
            flex: 1,
            fontSize: 22,
            fontWeight: "bold",
            // fontFamily: "Inconsolata",
            textAlign: "center",
        },
        deleteButton: {
            flex: 0.08,
            backgroundColor: colors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 2,
            borderColor: colors.black,
        },

    });


    // constant structures
    const orderTypes = [
        "Cake",
        "Cookies", 
        "Cupcakes", 
        "Other"
    ];

    const detailObjects = {
        "Cake Tier" : {
            tierSize: "",
            tierCakeFlavor: "",
            tierFillingFlavor: "",
            tierFrostingFlavor: "",
            fondant: "",
        },
        "Cake Decoration" : {
            decorationType: "",
            numberOfDecorations: "",
            decorationDescription: "",
        },
        "Cookie Batch" : {
            cookieType: "",
            cookieNumber: "",
            cookieFlavor: "",
            cookieFilling: "",
            cookieDecoration: "",
        },
        "Cupcake Batch" : {
            cupcakeType: "",
            cupcakeNumber: "",
            cupcakeFlavor: "",
            cupcakeFilling: "",
            cupcakeFrosting: "",
            cupcakeDecoration: "",
        },
        "Custom Detail" : {
            type: "",
            number: "",
            description: "",
        },
    };
    const detailTypes = Object.keys(detailObjects);
    const chosenOrderType = upperParams.basic.orderType;


    // should know
    const orderName = upperParams.basic.orderName;

    // States
    const [orderDetails, setOrderDetails] = useState(upperParams.orderDetails);
    const [orderTypeCounter, setOrderTypeCounter] = useState([0, 0, 0, 0, 0]);

    // Functions
    const addOrderDetail = (detailType) => {
        // detailType MUST be one of the keys in detailObjects
        const key = detailType + " #" + orderTypeCounter[detailTypes.indexOf(detailType)];
        
        // update the counter for the detailType
        const updatedOrderTypeCounter = [...orderTypeCounter];
        updatedOrderTypeCounter[detailTypes.indexOf(detailType)] += 1;
        setOrderTypeCounter(updatedOrderTypeCounter);
        
        // add the detail to the orderDetails
        const updatedOrderDetails = {...orderDetails};
        updatedOrderDetails[key] = detailObjects[detailType];
        setOrderDetails(updatedOrderDetails);
    };

    const handleOrderDetailChange = (key, field, value) => {
        const updatedOrderDetails = {...orderDetails};
        updatedOrderDetails[key][field] = value;
        setOrderDetails(updatedOrderDetails);
    };

    const deleteOrderDetail = (key) => {
        // we dont update the counter here to keep the order of the details
        const updatedOrderDetails = {...orderDetails};
        delete updatedOrderDetails[key];
        setOrderDetails(updatedOrderDetails);
    };

    const transformOrderDetailsToJson = () => {
        const orderDetailsJson = [];

        // for each set of details
        for (const group in orderDetails) {
            const groupElements = orderDetails[group];
            
            for (const element in groupElements) {
                
                const detailJson = {
                    fieldName: `${group} -- ${element}`,
                    fieldValue: groupElements[element]
                };

                orderDetailsJson.push(detailJson);
            }
        }

        return orderDetailsJson;
    };

    const finishOrder = () => {
        // fetch request to backend to add order to database
        const orderEndpoint = "orders";

        // config vars
        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const orderBody = {
            basic : upperParams.basic,
            orderDetails : transformOrderDetailsToJson(),
        }

        const orderOptions = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(orderBody)
        };

        fetch(BASE_URL + orderEndpoint, orderOptions)
            .then(response => {
                if (response.status === 403) {
                    alert("You are not authorized to perform this action.");
                    return;
                }
                console.log("Order successfully added to database");
            })
            // no data returned from backend
            .catch(error => {
                console.log(error);
                alert("Error adding order: " + error);
        });

        // pop the two previous screens off the stack
        props.navigation.popToTop();
        props.navigation.push("HomeScreen", {
            userId: upperParams.userId,
            shopId: upperParams.shopId,
            shopName: upperParams.shopName,
            colorway: upperParams.colorway,
            token: upperParams.token
        })
    };

    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {"Creating"} Order {orderName} Details </Text>
            </View>
            
            <View style = {styles.detailSection}>
                <ScrollView style={{flex: 1}}>
                    {Object.entries(orderDetails).map(([key, value]) => (
                    <View key={key} style={{marginBottom: 20}}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailHeaderTitle}> {key} </Text>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteOrderDetail(key)}>
                                <Text style={font_styles.body}> X </Text>
                            </TouchableOpacity>
                        </View>
                        {Object.keys(value).map((field, index) => (
                            <View key={`${key}-order-field-${field}-${index}`} style={styles.orderInput}>
                                <Text style={styles.label}>{field}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={field}
                                    value={value[field]}
                                    onChangeText={(value) =>
                                        handleOrderDetailChange(key, field, value)
                                    }
                                    multiline={true}
                                    scrollEnabled={true}
                                />
                            </View>
                        ))}
                    </View>
                    ))}
                </ScrollView>
                
                {chosenOrderType === orderTypes[0] && 
                (
                <View style={styles.addButtonSection}>
                    <TouchableOpacity style={[styles.addDetailButton, {borderRightWidth: 2}]} onPress={() => addOrderDetail(detailTypes[0])}>
                        <Text style={font_styles.body}> Add Cake Tier </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addDetailButton} onPress={() => addOrderDetail(detailTypes[1])}>
                        <Text style={font_styles.body}> Add Cake Decoration </Text>
                    </TouchableOpacity>
                </View>
                )}
                
                {chosenOrderType === orderTypes[1] && 
                (
                <View style={styles.addButtonSection}>
                    <TouchableOpacity style={styles.addDetailButton} onPress={() => addOrderDetail(detailTypes[2])}>
                        <Text style={font_styles.subtitle}> Add Cookie Batch </Text>
                    </TouchableOpacity>
                </View>
                )}

                {chosenOrderType === orderTypes[2] && 
                (
                <View style={styles.addButtonSection}>
                    <TouchableOpacity style={styles.addDetailButton} onPress={() => addOrderDetail(detailTypes[3])}>
                        <Text style={font_styles.subtitle}> Add Cupcake Batch </Text>
                    </TouchableOpacity>
                </View>
                )}

                {chosenOrderType === orderTypes[3] && 
                (
                <View style={styles.addButtonSection}>
                    <TouchableOpacity style={styles.addDetailButton} onPress={() => addOrderDetail(detailTypes[4])}>
                        <Text style={font_styles.subtitle}> Add Custom Order Detail </Text>
                    </TouchableOpacity>
                </View>
                )}  
                
            </View>
    
            <TouchableOpacity style={styles.finishButton} onPress={finishOrder}>
                <Text style={font_styles.subtitle}> Finish Order </Text>
            </TouchableOpacity>
        </View>
    );
}


export default AddOrderFurtherDetailsScreen;