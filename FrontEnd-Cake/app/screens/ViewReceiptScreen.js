import {React, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Pressable, Platform, ScrollView } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';


function ViewReceiptScreen(props) {

    const basicOrderDetails = {
        orderId: "<Order ID>",
        orderName: "<Order Name>",
        deliveryDate: new Date(),
        clientContact: "<Client Contact>",
        extraNotes: "<Extra Notes>",
        estimatedCost: "<Estimated Cost>",
        orderType: "Cake",
    }

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


    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> Viewing Order {basicOrderDetails.orderId} </Text>
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
                
            </View>
        </View>
    );
}


// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginVertical: 20,
    },

    titleBar: {
        flex: 1,
        backgroundColor: colors.primary_default,
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
        borderColor: colors.primary_default,
        // marginVertical: 30,
        backgroundColor: colors.secondary,
    },

    topSectionContent: {
        flex: 0.8,
        marginVertical: 20,
        borderWidth: 2,
    },

    bottomSectionContent: {
        flex: 1.5,
        marginVertical: 20,
        borderWidth: 2,
    },



});

export default ViewReceiptScreen;