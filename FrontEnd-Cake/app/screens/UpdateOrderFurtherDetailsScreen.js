import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import groupDetails from '../../config/orderViewUtil';
import BASE_URL from '../../config/network';


function AddOrderFurtherDetailsScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;
    const basic = upperParams.basic;
    const fullOrder = upperParams.orderObject;

    // console.log("Params inherited: ", JSON.stringify(upperParams));

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

    // constant controlling whether this page is being displayed for creation of a new order or editing of an existing one

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

    // setting function
    const setCounter = () => {
        const counter = [0, 0, 0, 0, 0];  // how it starts off
        
        // for each detail in orderDetailsView (for each key) split the key based on the ' #'
        // and then increment the counter at the index of the detailType
        for (const item in orderDetails) {
            // take the array element, take its key, split it, and then increment the counter
            const detailType = item.split(" #")[0];

            // make sure to set it to the max of the counts among the different detail types

            if (counter[detailTypes.indexOf(detailType)] <= item.split(" #")[1]) {
                counter[detailTypes.indexOf(detailType)] = parseInt(item.split(" #")[1]) + 1;
            }

        }
        return counter;
    };

    // States
    const [orderDetails, setOrderDetails] = useState(groupDetails(upperParams.orderDetails, true));
    const [orderTypeCounter, setOrderTypeCounter] = useState(setCounter());
    const [deletedOrderDetails, setDeletedOrderDetails] = useState([]);  // just the ids
    const [addedOrderDetails, setAddedOrderDetails] = useState({});  // the entire added objects

    console.log("\n\n Order Details \n\n" + JSON.stringify(orderDetails) + "\n\n");
    console.log("\n\n\nOG:  " + JSON.stringify(upperParams.orderDetails));
    // console.log("\n\n\nDeleted Order Details: " + deletedOrderDetails);
    // console.log("\n\n\nAdded Order Details: " + JSON.stringify(addedOrderDetails));

    // Functions
    const addOrderDetail = (detailType) => {
        // detailType MUST be one of the keys in detailObjects
        const key = detailType + " #" + orderTypeCounter[detailTypes.indexOf(detailType)];
        
        // update the counter for the detailType
        const updatedOrderTypeCounter = [...orderTypeCounter];
        updatedOrderTypeCounter[detailTypes.indexOf(detailType)] += 1;
        setOrderTypeCounter(updatedOrderTypeCounter);
        
        // add the detail to the addedOrderDetails and orderDetails 
        const updatedAddedOrderDetails = {...addedOrderDetails};
        updatedAddedOrderDetails[key] = detailObjects[detailType];
        setAddedOrderDetails(updatedAddedOrderDetails);

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
        // add the orderDetailFieldIds of the object related to the key to the deletedOrderDetails
        const orderDetailFieldGroup = orderDetails[key];
        
        // add the deleted orderDetailFieldIds for deletion when the key for such details is one of the original ones
        
        if (!(key in addedOrderDetails)) {
            const updatedDeletedOrderDetails = [...deletedOrderDetails];
            for (const item in orderDetailFieldGroup) {
                const id = item.split(" -- ")[1];
                updatedDeletedOrderDetails.push(id);
            }
            setDeletedOrderDetails(updatedDeletedOrderDetails);
        } else {
            // otw delete it from the addedOrderDetails list
            const updatedAddedOrderDetails = {...addedOrderDetails};
            delete updatedAddedOrderDetails[key];
            setAddedOrderDetails(updatedAddedOrderDetails);
        }

        // delete it from orderDetails being displayed
        const updatedOrderDetails = {...orderDetails};
        delete updatedOrderDetails[key];
        setOrderDetails(updatedOrderDetails);
    };

    const transformOrderDetailsToJson = (details) => {
        const detailsJson = [];

        // for each set of details
        for (const group in details) {
            const groupElements = details[group];
            
            for (const element in groupElements) {
                
                const detailJson = {
                    orderId: upperParams.basic.orderId,
                    fieldName: `${group} -- ${element}`,
                    fieldValue: groupElements[element]
                };

                detailsJson.push(detailJson);
            }
        }

        return detailsJson;
    };

    // for managing update of order details
    const getUpdatedOrderDetails = () => {
        // return the list of orderDetails the same way it came, only modifying the ones that
        // had their corresponding values changed
        const updatedOrderDetails = upperParams.orderDetails;

        updatedOrderDetails.forEach((detail, index) => {
            // look for the detail in the orderDetails
            const detailGroup = detail.fieldName.split(" -- ")[0];
            if (detailGroup in orderDetails) {
                const detailElement = detail.fieldName.split(" -- ")[1] + " -- " + detail.orderDetailFieldId;
                // detail group is in orderDetails, so detaupdate the detail
                updatedOrderDetails[index] = {
                    ...detail,
                    fieldValue: orderDetails[detailGroup][detailElement]
                };
            }
        });

        return updatedOrderDetails;

    }

    const getModifiedOrderChain = (basic, details) => {
        // at the chained order index, modify the order to be made up of basic and details
        const modifiedOrderChain = [...fullOrder];
        modifiedOrderChain[upperParams.chainPosition] = {
            basic: basic,
            orderDetails: details
        };
        return modifiedOrderChain;
    };

    const checkShownProperty = (propertyString) => {
        if (propertyString.split(" -- ").length > 1) {
            return propertyString.split(" -- ")[0];
        } else {
            return propertyString;
        }
    };

    const finishOrderUpdate = () => {
        console.log("Finishing Order Update");
        // fetch request to backend to add order to database
        const orderEndpoint = "orders/update";

        // config vars
        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const orderBody = getModifiedOrderChain(upperParams.basic, getUpdatedOrderDetails());

        const orderOptions = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(orderBody)
        };

        fetch(BASE_URL + orderEndpoint, orderOptions)
            .then(response => {
                if (response.status === 403) {
                    alert("You are not authorized to perform this action.");
                    return;
                } else if (response.status === 200) {
                    console.log("Order successfully added to database");

                    // proceed to remove the deleted orderDetails
                    deletedOrderDetails.forEach((id) => {
                        console.log("Deleting order detail: " + id);
                        const deleteEndpoint = "orderDetails/" + id;
                        const deleteOptions = {
                            method: "DELETE",
                            headers: headers
                        };

                        fetch(BASE_URL + deleteEndpoint, deleteOptions)
                            .then(response => {
                                if (response.status === 403) {
                                    alert("You are not authorized to perform this action.");
                                    return;
                                } else if (response.status === 200) {
                                    console.log("Order Detail successfully deleted from database");
                                }
                            })
                            // no data returned from backend
                            .catch(error => {
                                console.log(error);
                                alert("Error deleting order detail: " + error);
                            });
                    });

                    // proceed to add the added orderDetails
                    const addedOrderDetailsJson = transformOrderDetailsToJson(addedOrderDetails);
                    const addEndpoint = "orderDetails";
                    
                    addedOrderDetailsJson.forEach((detail) => {
                        console.log("Adding order detail: " + JSON.stringify(detail));
                        const addDetailOptions = {
                            method: "POST",
                            headers: headers,
                            body: JSON.stringify(detail)
                        };

                        fetch(BASE_URL + addEndpoint, addDetailOptions)
                            .then(response => {
                                if (response.status === 403) {
                                    alert("You are not authorized to perform this action.");
                                    return;
                                } else if (response.status === 200) {
                                    console.log("Order Detail successfully added to database");
                                }
                            })
                            // no data returned from backend
                            .catch(error => {
                                console.log(error);
                                alert("Error adding order detail: " + error);
                            }
                        );
                    });
                }
                
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
                <Text style={font_styles.title}> {upperParams.editing ? "Editing" : "Creating"} Order {orderName} Details </Text>
            </View>
            
            <View style = {styles.detailSection}>
                <ScrollView style={{flex: 1}}>
                    {Object.entries(orderDetails).map(([key, value]) => (
                    <View key={key} style={{marginBottom: 20}}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailHeaderTitle}> {key.split(' -- ')[0]} </Text>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteOrderDetail(key)}>
                                <Text style={font_styles.body}> X </Text>
                            </TouchableOpacity>
                        </View>
                        {Object.keys(value).map((field, index) => (
                            <View key={`${key}-order-field-${field}-${index}`} style={styles.orderInput}>
                                <Text style={styles.label}>{checkShownProperty(field)}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={field.split(' -- ')[0]}
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
    
            <TouchableOpacity style={styles.finishButton} onPress={finishOrderUpdate}>
                <Text style={font_styles.subtitle}> Finish Order </Text>
            </TouchableOpacity>
        </View>
    );
}


export default AddOrderFurtherDetailsScreen;