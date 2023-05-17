import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Pressable, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';


function AddOrderScreen(props) {

    // should know
    const orderName = "<Order Name>";

    // States
    const [orderDetails, setOrderDetails] = useState([]);
    
    console.log(orderDetails);

    // Functions
    const addOrderDetail = () => {
        // function to leave the rest of the order and order details as is and only add a new order detail
        // to the list
        setOrder((prevOrder) => ({
        ...prevOrder,
        orderDetails: [
            ...prevOrder.orderDetails,
            { field1: '', field2: '', field3: '' }, // Replace with your desired fields
        ],
        }));
    };

    const handleOrderDetailChange = (index, field, value) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            orderDetails: prevOrder.orderDetails.map((detail, i) =>
            i === index ? { ...detail, [field]: value } : detail
            ),
        }));
    };

    const finishOrder = () => {
        console.log("Finishing Order");
    };

    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> Order {orderName} Details </Text>
            </View>
            
            <View style = {styles.detailSection}>
                <ScrollView style={{flex: 1}}>
                    {/* Example: Render order details */}
                    {orderDetails.map((detail, index) => (
                    <View key={index}>
                        <TextInput
                        placeholder="Field 1"
                        value={detail.field1}
                        onChangeText={(value) =>
                            handleOrderDetailChange(index, 'field1', value)
                        }
                        />
                        <TextInput
                        placeholder="Field 2"
                        value={detail.field2}
                        onChangeText={(value) =>
                            handleOrderDetailChange(index, 'field2', value)
                        }
                        />
                        {/* Add more text inputs for other fields */}
                    </View>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.addDetailButton} onPress={finishOrder}>
                    <Text style={font_styles.subtitle}> Add Detail </Text>
                </TouchableOpacity>
            </View>
    
            <TouchableOpacity style={styles.finishButton} onPress={finishOrder}>
                <Text style={font_styles.subtitle}> Finish Order </Text>
            </TouchableOpacity>
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
        flex: 0.8,
        backgroundColor: colors.primary_default,
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
        borderWidth: 1,
        borderColor: colors.darker_secondary,
        padding: 5,
        fontSize: 15,
        borderRadius: 5,
    },

    addDetailButton: {
        flex: 0.08,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: colors.black,
    },

    finishButton: {
        flex: 0.6,
        backgroundColor: colors.primary_default,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginTop: 0,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.black,
    },

});

export default AddOrderScreen;