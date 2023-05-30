import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';


function AddOrderFurtherDetailsScreen(props) {

    // constant controlling whether this page is being displayed for creation of a new order or editing of an existing one
    const editing = props.route.params.editing;
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
    const chosenOrderType = orderTypes[3];


    // should know
    const orderName = "<Order Name>";

    // States
    const [orderDetails, setOrderDetails] = useState(editing ? existingOrderDetails : {});
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
        console.log(updatedOrderDetails);
        console.log(key);
        setOrderDetails(updatedOrderDetails);
    };

    const handleOrderDetailChange = (key, field, value) => {
        const updatedOrderDetails = {...orderDetails};
        updatedOrderDetails[key][field] = value;
        setOrderDetails(updatedOrderDetails);
    };

    const finishOrder = () => {
        console.log("Finishing Order");
        // fetch request to backend to add order to database

        // pop the two previous screens off the stack
        props.navigation.popToTop();
        props.navigation.push("HomeScreen")
    };

    // Screen
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {editing ? "Editing" : "Creating"} Order {orderName} Details </Text>
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

export default AddOrderFurtherDetailsScreen;