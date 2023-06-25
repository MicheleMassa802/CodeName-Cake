import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';

import BASE_URL from '../../config/network';


function AddOrderFurtherDetailsScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;
    const basic = upperParams.basic;

    console.log("Params inherited: ", JSON.stringify(upperParams));

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

    });

    // constant controlling whether this page is being displayed for creation of a new order or editing of an existing one

    const existingOrderDetails = {
        "Cake Tier #0" : {
            tierSize: "6 inch",
            tierCakeFlavor: "Chocolate",
            tierFillingFlavor: "Vanilla",
            tierFrostingFlavor: "Chocolate",
            fondant: "Yes",
        },
        "Cake Tier #1" : {
            tierSize: "8 inch",
            tierCakeFlavor: "Vanilla",
            tierFillingFlavor: "Chocolate",
            tierFrostingFlavor: "Vanilla",
            fondant: "No",
        },
        "Cake Decoration #0" : {
            decorationType: "Flowers",
            numberOfDecorations: "10",
            decorationDescription: "Pink and White",
        },
    };

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
    
    console.log(orderDetails);

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
        // console.log(updatedOrderDetails);
        // console.log(key);
        setOrderDetails(updatedOrderDetails);
    };

    const handleOrderDetailChange = (key, field, value) => {
        const updatedOrderDetails = {...orderDetails};
        updatedOrderDetails[key][field] = value;
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
        console.log("Finishing Order");
        // fetch request to backend to add order to database
        const orderEndpoint = upperParams.editing ? "orders/update" : "orders";

        // config vars
        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const orderBody = {
            basic : upperParams.basic,
            orderDetails : transformOrderDetailsToJson(),
        }

        console.log("\n\n\n ORDER BODY \n\n " + JSON.stringify(orderBody) + "\n\n\n");

        const orderOptions = {
            method: upperParams.editing ? "PUT" : "POST",
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


    const getOrderDetailsViewingFormat = () => {
        // orderDetails comes in the form: 
        // [{
        //     "orderDetailFieldId": x,
        //     "orderId": n,
        //     "fieldName": "Group Name -- Property",
        //     "fieldValue": "Property Value"
        // }],
        // want to return an object of form:
        //  "Group Name : {
        //    property : property value
        // }"

        // make the outer dictionary to return
        

        // for each item in the list, split the fieldname based on the '--' section
        // then add that as a key to the dictionary with a value of a dictionary with its second half of the split as key and the fieldvalue as value.
        // do that for all items checking which belong to which dictionary, and then you'll be able to display it just fine

        // Also details cant be added with edits


    }  


    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {upperParams.editing ? "Editing" : "Creating"} Order {orderName} Details </Text>
            </View>
            
            <View style = {styles.detailSection}>
                <ScrollView style={{flex: 1}}>
                    {Object.entries(orderDetails).map(([key, value]) => (
                    <View key={key} style={{marginBottom: 20}}>
                        <Text style={font_styles.subtitle}> {key} </Text>
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