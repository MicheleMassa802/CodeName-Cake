import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';


function AddOrderScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

    console.log("Params inherited: ", JSON.stringify(upperParams));

    // Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginVertical: 20,
    },

    titleBar: {
        flex: 1,
        backgroundColor: colorway,
        borderBottomWidth: 4,
        borderColor: colors.darker_secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    detailSection: {
        flex: 5,
        margin: 10,

    },

    orderInput: {
        marginVertical: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    multipleChoice: {
        marginVertical: 10,
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    button: {
        marginHorizontal: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.black,
        padding: 8,
        marginVertical: 5,
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5, // equivalent to margin: 10px 0px 10px 0px
        // fontFamily: "Inconsolata",
    },

    input: {
        borderWidth: 1,
        borderColor: colors.darker_secondary,
        padding: 5,
        fontSize: 16,
        borderRadius: 5,
    },

    continueButton: {
        flex: 0.5,
        backgroundColor: colorway,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginTop: 0,
        // padding: 15,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.black,
    },

});

    // constant controlling whether this page is being displayed for creation of a new order or editing of an existing one
    const editing = upperParams.editing;
    
    const todayString = new Date().toISOString().split('T')[0];
    
    const existingOrder = {
        orderName: "<Order Name>",
        deliveryDate: todayString,
        clientContact: "<Client Contact>",
        extraNotes: "<Extra Notes>",
        estimatedCost: "<Estimated Cost>",
        orderType: "Cake",
    };


    // States
    const [order, setOrder] = useState({
        orderName: editing ? existingOrder.orderName : "",
        deliveryDate: editing ? existingOrder.deliveryDate : todayString,
        clientContact: editing ? existingOrder.clientContact : "",
        extraNotes: editing ? existingOrder.extraNotes : "",
        estimatedCost: editing ? existingOrder.estimatedCost : "",
        orderType: editing ? existingOrder.orderType : "",
        // orderDetails: [],
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    console.log(order.orderName, order.deliveryDate, order.clientContact, order.extraNotes, order.estimatedCost, order.orderType, order.orderDetails);


    // Functions
    const handleInputChange = (field, value) => {
        // function to leave the rest of the order as is and only update the field that changed
        setOrder((prevOrder) => ({
        ...prevOrder,
        [field]: value,
        }));
    };
    
    const continueToOrderDetails = () => {
        console.log("Continueing to Order Details");
        // still not a fetch but pass on all the args so far
        props.navigation.push("AddOrderFurtherDetailsScreen", {
            ...upperParams,
            order: order});
    };

    const toggleDatePicker = () => { 
        setShowDatePicker(!showDatePicker); 
    };

    const onDateChange = (date) => {
        // transform date to be 4 hours behind (EST) to account for timezone difference
        date.setHours(date.getHours() - 4);
        // transform the date into a string
        date = date.toISOString().split('T')[0];
        handleInputChange('deliveryDate', date);
        toggleDatePicker();
    };  

    // Screen
    return (
        <View style={styles.container}>

            {/* Actual Screen to Display */}

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {editing ? "Edit Order" : "Place Order"} </Text>
            </View>

            <View style={styles.detailSection}>


                <View style={styles.orderInput}>
                    <Text style={styles.label}>Order Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Order Name"
                        value={order.orderName}
                        onChangeText={(value) => handleInputChange('orderName', value)}
                    />
                </View>

                {!showDatePicker && (<Pressable style={styles.orderInput} onPress={toggleDatePicker}>
                    <Text style={styles.label}>Delivery Date</Text>
                    {/* Only shown when showDatePicker is set to true  */}
                    <TextInput
                        style={styles.input}
                        placeholder="Select Delivery Date"
                        value={order.deliveryDate}
                        onChangeText={(value) => handleInputChange('deliveryDate', value)}
                        editable={false}
                        onPressIn={toggleDatePicker}
                    />
                </Pressable>)}

                {/* Date Picker Pop Up*/}
                {showDatePicker && (
                <View style={{flexDirection:"row", justifyContent: "space-around", alignContent: 'center'}}>
                    <View style={{justifyContent: "center"}}>
                        <Text style={styles.label}>Select Delivery Date: </Text>
                    </View>
                    <DateTimePicker
                        mode="date"
                        display="default"
                        value={order.deliveryDate}
                        onChange={(event, date) => onDateChange(date)}
                        minDate={utils.minDate}
                        maxDate={utils.maxDate}
                        style={
                            {
                                // center the date picker
                                alignSelf: 'center',
                                marginVertical: 20,
                            }
                        }
                    />
                </View>)}

                {/* IOS specific buttons (apple please be fucking normal next time) */}
                {showDatePicker && Platform.OS === "ios" && (
                    <View style={{flexDirection:"row", justifyContent: "space-around"}}>
                        <TouchableOpacity style={{paddingHorizontal: 20, height: 50, justifyContent:"center", alignItems: "center", borderRadius:50, backgroundColor: colors.secondary}}
                                          onPress={toggleDatePicker}>
                            <Text style={font_styles.body}> Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{paddingHorizontal: 20, height: 50, justifyContent:"center", alignItems: "center", borderRadius:50, backgroundColor: colors.secondary}}
                                          onPress={toggleDatePicker}>
                            <Text style={font_styles.body}> Ok </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.orderInput}>
                    <Text style={styles.label}>Client Contact</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Client Contact"
                        value={order.clientContact}
                        onChangeText={(value) => handleInputChange('clientContact', value)}
                    />
                </View>
                
                <View style={styles.orderInput}>
                    <Text style={styles.label}>Extra Notes</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Include any extra notes here"
                        value={order.extraNotes}
                        onChangeText={(value) => handleInputChange('extraNotes', value)}
                    />
                </View>

                <View style={styles.orderInput}>
                    <Text style={styles.label}>Estimated Cost</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        placeholder="Enter Estimated Cost"
                        value={order.estimatedCost}
                        onChangeText={(value) => handleInputChange('estimatedCost', value)}
                    />
                </View>

                <View style={styles.multipleChoice}>
                    <Text style={styles.label}>Order Type</Text>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: order.orderType === "Cake" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cake')}>
                        <Text style={font_styles.body}> {"Cake"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: order.orderType === "Cookies" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cookies')}>
                        <Text style={font_styles.body}> {"Cookies"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: order.orderType === "Cupcakes" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cupcakes')}>
                        <Text style={font_styles.body}> {"Cupcakes"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: order.orderType === "Other" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Other')}>
                        <Text style={font_styles.body}> {"Other"} </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={continueToOrderDetails}>
                <Text style={font_styles.subtitle}> Continue To Order Details </Text>
            </TouchableOpacity>
        </View>
    );
}



export default AddOrderScreen;