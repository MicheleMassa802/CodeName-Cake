import {React, useState} from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Pressable, Platform, ScrollView, Linking } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';

import BASE_URL from '../../config/network';



function ViewReceiptScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;
    const orderIdParam = upperParams.orderId;

    const orderObject = upperParams.orderObject;  // the order object to be displayed

    // console.log("Params inherited: ", JSON.stringify(upperParams));
    
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

    const endpoint = "orders/getReceiptPdf/" + upperParams.orderId;
    const receiptUrl = BASE_URL + endpoint;
    console.log("Receipt URL: ", receiptUrl);

    const openPDF = () => {
        // Note: pdf opening requires no authorization
        Linking.openURL(receiptUrl)
        .catch((err) => console.error('An error occurred', err));
    }

    const goToAttachedOrder = () => {
        console.log("Going to attached order");
        // take the attachedOrder attribute from the corresponding column
        upperParams.chainPosition += 1;
        props.navigation.push("ViewReceiptScreen", 
        {   ...upperParams,
        });
    }

    const editOrder = () => {
        console.log("Editing order");
        // go to order editing screen
        upperParams.chainPosition = 0;  // reset to the first order in the chain when going to edit
        props.navigation.push("AddOrderScreen", {...upperParams, editing: true});
    }

    const groupDetails = (details) => {
        const groupedDetails = {};

        details.forEach((detail) => {
            // for each detail, split its name into its group (such as "Cake Tier #0") and property
            const splitName = detail.fieldName.split(" -- ");
            const groupName = splitName[0];
            const propertyName = splitName[1];
            const propertyValue = detail.fieldValue;

            // add the group to the groupedDetails object if it doesn't exist with the new property
            if (!(groupName in groupedDetails)) {
                groupedDetails[groupName] = { [propertyName] : propertyValue};
            } else {
                // otherwise, add the property to the group
                groupedDetails[groupName][propertyName] = propertyValue;
            }

        });

        console.log("Grouped details: ", groupedDetails);

        return groupedDetails;

    }

    // Params and values to be displayed
    const chainPosition = upperParams.chainPosition;

    const basicOrderDetails = orderObject[chainPosition].basic;
    const furtherOrderDetails = groupDetails(orderObject[chainPosition].orderDetails);
    const futureOrder = utils.isFuture(basicOrderDetails.deliveryDate);
    const chainedOrder = basicOrderDetails.attachedNextOrder !== null; // true if the attachedOrder field in the order object is not null
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
                    <Text style={font_styles.body}> Delivery Date: {basicOrderDetails.deliveryDate} </Text>
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