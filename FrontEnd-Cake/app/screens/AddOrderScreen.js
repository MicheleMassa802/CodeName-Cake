import {React, useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';
import BASE_URL from '../../config/network';


function AddOrderScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

    // console.log("Params inherited: ", JSON.stringify(upperParams));

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
    
    // today = new Date - 4 hours -> string
    const todayString = utils.getTodaysDate();

    // States
    const [basic, setBasic] = useState({
            shopId: upperParams.shopId,
            orderName: "",
            dateReceived: todayString,
            deliveryDate: todayString,
            clientContact: "",
            extraNotes: "",
            estimatedCost: "",
            orderType:""

    });
    const [orderDetails, setOrderDetails] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);


    // Functions

    // fetch content when component mounts
    useEffect(() => {
        const fetchData = async () => {

            // only perform when editing an order
            if (editing) {
                setBasic(upperParams.orderObject[upperParams.chainPosition].basic);
                // make the estimatedCost into a string
                setBasic((prevBasic) => ({
                    ...prevBasic,
                    estimatedCost: prevBasic.estimatedCost.toString(),
                }));

                setOrderDetails(upperParams.orderObject[upperParams.chainPosition].orderDetails);
            }
            
        };

        fetchData();
    }, []);

    // console.log("Data: ", basic.orderName, basic.deliveryDate, basic.clientContact, basic.extraNotes, basic.estimatedCost, basic.orderType, basic.orderDetails);

    const handleInputChange = (field, value) => {
        // function to leave the rest of the order as is and only update the field that changed

        setBasic((prevBasic) => ({
        ...prevBasic,
        [field]: value,
        }));
    };
    
    const continueToOrderDetails = () => {
        
        // check if all required fields are filled in
        if (basic.orderName === "" || basic.deliveryDate === "" || basic.clientContact === "" || basic.orderType === "") {
            alert("Please fill in all required fields");
            return;
        }
        
        // console.log("Continueing to Order Details with order: ", JSON.stringify(basic), JSON.stringify(orderDetails));
        // still not a fetch but pass on all the args so far
        
        // set estimatedCost to 0 if empty or to its respective integer value if not
        if (basic.estimatedCost === "") {
            basic.estimatedCost = 0;
        } else {
            basic.estimatedCost = parseInt(basic.estimatedCost);
        }
        console.log(JSON.stringify(basic));


        if (!upperParams.editing) {
            props.navigation.push("AddOrderFurtherDetailsScreen", {
                ...upperParams,
                basic: basic,
                orderDetails: {}
            });
        } else {
            props.navigation.push("UpdateOrderFurtherDetailsScreen", {
                ...upperParams,
                basic: basic,
                orderDetails: orderDetails
            });
        }


    };

    const toggleDatePicker = () => { 
        setShowDatePicker(!showDatePicker); 
    };

    const onDateChange = (event, date) => {

        const initialDate = basic.deliveryDate;
        
        if (date !== undefined && event.type === "set") {
            // transform date to be 4 hours behind (EST) to account for timezone difference
            date.setHours(date.getHours() - 4);
            // transform the date into a string
            date = date.toISOString().split('T')[0];
            handleInputChange('deliveryDate', date);
        }
        toggleDatePicker();

        if (utils.isPast(date)) {
            alert("You are placing an order for a past month. This will not affect your stats, so please make sure you are placing the order for the correct month.");
            handleInputChange('deliveryDate', initialDate);
        }
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
                        value={basic.orderName}
                        onChangeText={(value) => handleInputChange('orderName', value)}
                    />
                </View>

                {!showDatePicker && (<Pressable style={styles.orderInput} onPress={toggleDatePicker}>
                    <Text style={styles.label}>Delivery Date</Text>
                    {/* Only shown when showDatePicker is set to true  */}
                    <TextInput
                        style={styles.input}
                        placeholder="Select Delivery Date"
                        value={basic.deliveryDate}
                        onChangeText={(value) => handleInputChange('deliveryDate', value)}
                        // onChangeText={(value) => onDateChange(value)}
                        editable={false}
                        // onPressIn={toggleDatePicker}
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
                        value={new Date(basic.deliveryDate)}
                        onChange={(event, date) => {onDateChange(event, date)}}
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
                        value={basic.clientContact}
                        onChangeText={(value) => handleInputChange('clientContact', value)}
                    />
                </View>
                
                <View style={styles.orderInput}>
                    <Text style={styles.label}>Extra Notes</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Include any extra notes here"
                        value={basic.extraNotes}
                        onChangeText={(value) => handleInputChange('extraNotes', value)}
                    />
                </View>

                <View style={styles.orderInput}>
                    <Text style={styles.label}>Estimated Cost</Text>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        placeholder="Enter Estimated Cost"
                        value={basic.estimatedCost}
                        onChangeText={(value) => handleInputChange('estimatedCost', value)}
                    />
                </View>

                <View style={styles.multipleChoice}>
                    <Text style={styles.label}>Order Type</Text>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: basic.orderType === "Cake" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cake')}>
                        <Text style={font_styles.body}> {"Cake"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: basic.orderType === "Cookies" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cookies')}>
                        <Text style={font_styles.body}> {"Cookies"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: basic.orderType === "Cupcakes" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Cupcakes')}>
                        <Text style={font_styles.body}> {"Cupcakes"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {[styles.button,
                        {backgroundColor: basic.orderType === "Other" ? colorway : colors.secondary}]} onPress={() => handleInputChange('orderType', 'Other')}>
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