import { React, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';

function ViewOrdersScreen(props) {
    
    const liveOrders = [
        {
            name: "John Doe",
            daysLeft: 3,
        }, 
        {
            name: "Jane Doe",
            daysLeft: 5,
        },
        {
            name: "Mario Gallo",
            daysLeft: 8,
        }, 
        {
            name: "Bejamin Tennyson",
            daysLeft: 10,
        },
        {
            name: "Gulliver HonestMan",
            daysLeft: 12,
        },
    ]

    const pastOrders = [
        {
            name: "John Doe",
            dateDelivered: "12/12/2020",
        },
        {
            name: "Jane Doe",
            dateDelivered: "12/12/2020",
        }
    ]

    const [selectedOrders, setSelectedOrders] = useState([]);  // to store the indeces into liveOrders that are selected
    
    const addSelectedOrder = (index) => {
        if (selectedOrders.includes(index)) {
            // remove the index from the array
            const indicesToKeep = selectedOrders.filter((item) => item !== index);
            setSelectedOrders(indicesToKeep);
        } else {
            // add the index to the array
            setSelectedOrders([...selectedOrders, index]);
        }
    }


    const transformSelectedIndecesIntoObjects = () => {
        // transform the indeces into objects
        const selectedObjects = [];
        selectedOrders.forEach((index) => {
            selectedObjects.push(liveOrders[index].name);
        });
        console.log("Selected Objects: ", selectedObjects);
        return selectedObjects;
    }

    console.log("Selected Orders: ", selectedOrders);
    transformSelectedIndecesIntoObjects();


    return (
        <View style={styles.container}>

            <View style = {styles.half}>
                <View style = {styles.titleBar}>
                    <Text style={font_styles.title}> Live Orders </Text>
                </View>
                <View style = {styles.content}>

                    <View style={styles.outerHeadingLine}>
                        <View style={[styles.headingLine, {width: '80%', height: '100%'}]}>
                            <Text style={styles.headingContent}> Order Name </Text>
                            <Text style={styles.headingContent}> Days Left </Text>
                        </View>
                        {selectedOrders.length > 1 &&
                            <TouchableOpacity style = {styles.button} onPress={() => console.log("Merging the orders")}>
                                <Text style={font_styles.smallBody}> Merge </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    
                    <View style={{flex: 4}}>
                        <ScrollView>

                            {liveOrders.map((item, index) => (
                                <View key={index} style={styles.lineSelect}>
                                    <TouchableOpacity style = {[styles.contentLine, {width: '80%'}]} onPress={() => console.log("Onto this Current order")}>
                                        <Text style={styles.innerContent}> {item.name}</Text>
                                        <Text style={styles.innerContent}> {item.daysLeft} </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={index + "checkbox"} style = {styles.checkbox} onPress={() => addSelectedOrder(index)}>
                                        {selectedOrders.includes(index) && <View style = {styles.innerCheckbox}></View>}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    
                </View>
            </View>

            <View style = {styles.half}>
                <View style = {styles.titleBar}>
                    <Text style={font_styles.title}> Past Orders </Text>
                </View>
                <View style = {styles.content}>
                    <ScrollView>
                            <View style={styles.headingLine}>
                                <Text style={styles.headingContent}> Order Name </Text>
                                <Text style={styles.headingContent}> Date Delivered </Text>
                            </View>
                        {pastOrders.map((item, index) => (
                            <TouchableOpacity key={index + "past"} style = {styles.contentLine} onPress={() => console.log("Onto this Past order")}>
                                <Text style={styles.innerContent}> {item.name}</Text>
                                <Text style={styles.innerContent}> {item.dateDelivered} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginVertical: 20,
    },

    half: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'flex-start',

    },

    titleBar: {
        flex: 1,
        backgroundColor: colors.primary_default,
        borderBottomWidth: 4,
        borderColor: colors.darker_secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        flex: 7,
        margin: 20,
    },

    contentLine: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.primary_default,
        backgroundColor: colors.secondary,
        marginBottom: 15,
    },

    outerHeadingLine: {
        flex: 0.5,
        flexDirection: 'row',
        // alignContent: 'center',
        justifyContent: 'flex-start',
        marginBottom: '5%',

        // borderWidth: 3,
        // borderColor: 'red'
    },

    headingLine: {
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: colors.primary_default,
        marginBottom: 15,

        // borderWidth: 3,
        // borderColor: 'blue'
    },

    headingContent: {
        flex: 1,
        fontSize: 16,
        fontWeight : "bold",
        color: colors.black,
        textAlign: "center",
        justifyContent: 'center',
        alignContent: 'center',

        // borderWidth: 3,
        // borderColor: 'yellow'
    },

    innerContent: {
        flex: 1,
        fontSize: 16,
        fontWeight: "normal",
        color: colors.black,
        textAlign: "center",
    },

    checkbox: {
        width: 25,
        height: 25,
        backgroundColor: colors.secondary,
        borderWidth: 1,
        borderColor: colors.primary_default,
    },

    lineSelect: {
        flex: 0.12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },

    innerCheckbox: {
        flex: 1,
        backgroundColor: colors.primary_default,
    },

    button: {
        // flex: 0.2,
        width: '20%',
        backgroundColor: colors.primary_default,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        // marginVertical: 7,
        borderWidth: 1,
        borderColor: colors.darker_secondary,
        marginLeft: '5%',

    },


});

export default ViewOrdersScreen;