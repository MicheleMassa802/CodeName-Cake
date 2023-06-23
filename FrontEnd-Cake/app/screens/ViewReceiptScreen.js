import {React } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Pressable, Platform, ScrollView, Linking } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';



function ViewReceiptScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;
    const orderIdParam = upperParams.orderId;

    console.log("Params inherited: ", JSON.stringify(upperParams));
    
    // Styles
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            marginVertical: 20,
        },

        titleBar: {
            flex: 0.6,
            backgroundColor: colorway,
            borderBottomWidth: 4,
            borderColor: colors.darker_secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },


        detailSection: {
            flex: 6,
            margin: 15,

        },

        sectionDivider: {
            flex: 0.2,
            borderBottomWidth: 3,
            borderColor: colorway,
            // marginVertical: 30,
            backgroundColor: colors.secondary,
        },

        topSectionContent: {
            flex: 0.9,
            marginVertical: 20,
            borderWidth: 2,
        },

        bottomSectionContent: {
            flex: 1.3,
            marginVertical: 20,
            borderWidth: 2,
        },

        buttonPair: {
            flex: 0.25,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
        },

        subButton : {
            flex: 1,
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.black,
            backgroundColor: colorway,
        },

        button: {
            flex: 0.2,
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.black,
            padding: 8,
            marginVertical: 3,
            backgroundColor: colorway,
        },

    });

    const baseUrl = "http://192.168.0.113:8080/";
    const endpoint = "api/dev/orders/getReceiptPdf/1";
    const receiptUrl = baseUrl + endpoint;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const basicOrderDetails = {
        orderId: "<Order ID>",
        orderName: "<Order Name>",
        deliveryDate: tomorrow,  // if set to 'yesterday' you get the effect for past orders
        clientContact: "<Client Contact>",
        extraNotes: "<Extra Notes>",
        estimatedCost: "<Estimated Cost>",
        orderType: "Cake",
    }

    // if today is greater than the delivery date, then the order is in the past
    const futureOrder = today < basicOrderDetails.deliveryDate;

    const furtherOrderDetails = {
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
        "Cake Decoration #0" : {
            decorationType: "Flowers",
            numberOfDecorations: "10",
            decorationDescription: "Pink and White",
        },
    };
    

    const getStringDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return day + "-" + month + "-" + year;
    }

    const openPDF = () => {
        // Note: pdf opening requires no authorization
        Linking.openURL(receiptUrl)
        .catch((err) => console.error('An error occurred', err));
    }

    const goToAttachedOrder = () => {
        console.log("Going to attached order");
        // take the attachedOrder attribute from the corresponding column
        const attachedOrderId = 1;
        props.navigation.push("ViewReceiptScreen", {...upperParams});
    }

    const editOrder = () => {
        console.log("Editing order");
        // go to order editing screen
        props.navigation.push("AddOrderScreen", {...upperParams, editing: true});
    }

    const chainedOrder = true; // true if the attachedOrder field in the order object is not null
    // means that another screen with the following suborder details should be displayed too


    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> Viewing Order {orderIdParam} </Text>
            </View>

            <View style={styles.detailSection}>

                <View style={styles.sectionDivider}>
                    <Text style={font_styles.subtitle}> Basic Details: </Text>
                </View>

                <View style={styles.topSectionContent}>
                    <Text style={font_styles.body}> Order Name: {basicOrderDetails.orderName} </Text>
                    <Text style={font_styles.body}> Delivery Date: {getStringDate(basicOrderDetails.deliveryDate)} </Text>
                    <Text style={font_styles.body}> Client Contact: {basicOrderDetails.clientContact} </Text>
                    <Text style={font_styles.body}> Extra Notes: {basicOrderDetails.extraNotes} </Text>
                    <Text style={font_styles.body}> Estimated Cost: {basicOrderDetails.estimatedCost} </Text>
                    <Text style={font_styles.body}> Order Type: {basicOrderDetails.orderType} </Text>
                </View>
                
                <View style={styles.sectionDivider}>
                    <Text style={font_styles.subtitle}> Further Details: </Text>
                </View>
                
                <View style={styles.bottomSectionContent}>
                    <ScrollView>
                        {Object.entries(furtherOrderDetails).map(([key, value]) => (
                            <View key={key} style={{marginBottom: 15}}>
                                <Text style={font_styles.subtitle}> {key} </Text>
                                {Object.entries(value).map(([key2, value2]) => (
                                    <View key={key2}>
                                        <Text style={font_styles.body}> {key2}: {value2} </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
                
                <View style={styles.buttonPair}>
                    <TouchableOpacity style={styles.subButton} onPress={openPDF}>
                        <Text style={font_styles.body}> Print Order (PDF) </Text>
                    </TouchableOpacity>
                    {futureOrder && <TouchableOpacity style={styles.subButton} onPress={editOrder}>
                        <Text style={font_styles.body}> Edit Order </Text>
                    </TouchableOpacity>}
                </View>

                {chainedOrder && (
                    <TouchableOpacity style={styles.button} onPress={goToAttachedOrder}>
                        <Text style={font_styles.subtitle}> View Attached Order </Text>
                    </TouchableOpacity>
                )}

                
            </View>
        </View>
    );
}


export default ViewReceiptScreen;