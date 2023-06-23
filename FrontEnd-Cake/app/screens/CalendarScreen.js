import { React, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';

function CalendarScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

    console.log("Params inherited: ", JSON.stringify(upperParams));

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
    
        controlBar: {
            flex: 0.6,
            flexDirection: 'row',
            backgroundColor: colorway,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            // borderTopWidth: 4,
            borderWidth: 2,
            borderColor: colors.black,
            margin: 9,
            marginTop: 20,
        },
    
        button: {
            backgroundColor: colors.darker_secondary,
            borderRadius: 10,
            paddingHorizontal: '1.5%',
        },
    
        buttonText: {
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.darker_secondary,
        },
    
        separator: {
            width: '10%',
        },
    
        calendarSection: {
            flex: 5,
            margin: 9,
            borderWidth: 2,
        },
    
        content: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
    
        cell: {
            flexDirection: 'row',
            width: '25%',
            height: '12.5%',
            borderWidth: 1,
            borderColor: colors.black,
            justifyContent: 'center',
            alignItems: 'center',
        },
    
        events: {
            flex: 1,
            fontSize: 11,
            justifyContent: 'center',
            alignItems: 'center',
        },
    
        dateContent: {
            flex: 3,
            margin: 9,
            borderWidth: 2,
        },
    
        dateContentTitle: {
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            borderBottomColor: colors.darker_secondary,
            borderBottomWidth: 2,
            backgroundColor: colorway,
        }, 
    
        dateContentText: {
            fontSize: 16,
            fontWeight: "normal",
            flex: 1,
            marginTop: 8,
        },

        orderClick: {
            
        },
    });


    // for month-year handler
    const [month, setMonth] = useState(new Date().getMonth()); // [0, 11] 
    const [year, setYear] = useState(new Date().getFullYear());  // XXXX
    const [day, setDay] = useState(new Date().getDate()); // [1, 31]

    const mayOrders = {  // youd get this in a per month basis
        1: [  // key is the day of the month
            {
                id: 17,
                name: "John's Son Minion Birthday Cake and cookies",
            },
            {
                id: 18,
                name: "Jane's baptism Cupcakes",
            },
            {
                id: 19,
                name: "Laura's Wedding Cake",
            },
            {
                id: 20,
                name: "Rigobertha's Birthday Cake",
            }, // value is the object with order name and id (to find the order in the database)
        ],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10:[
            {
                id: 25,
                name: "Tiff Cupcakes",
            },
            {
                id: 26,
                name: "Giveaway Cookies",
            },
        ],
        11:[],
        12:[],
        13:[],
        14:[],
        15:[],
        16:[],
        17:[],
        18:[],
        19:[],
        20:[
            {
                id: 23,
                name: "Dad's Birthday Cake",
            },
        ],
        21:[],
        22:[],
        23:[],
        24:[],
        25:[],
        26:[],
        27:[],
        28:[],
        29:[],
        30:[],
        31:[],      
    }

    const datePressed = (date) => {
        console.log("Pressed on day " + date + " of " + utils.monthMap[month] + " " + year);
        setDay(date);
    }

    const determineColor = (date) => {
        if (mayOrders[date].length == 0) {
            return colors.green;
        } else if (mayOrders[date].length < 2) {
            return colors.yellow;
        } else if (mayOrders[date].length < 4) {
            return colors.orange;
        } else {
            return colors.red;
        }
    }

    const goToOrder = (orderId) => {
        // go to the order screen with the selected orders
        console.log("Going to order: ", orderId);
        props.navigation.push("ViewReceiptScreen", {
            ...upperParams,
            orderId: orderId
        });
    }


    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {upperParams.shopName}'s Calendar </Text>
            </View>
        
            <View style = {styles.controlBar}>
                <TouchableOpacity style = {styles.button} onPress={() => setMonth(utils.prevMonth(month))}>
                    <Text style={font_styles.subtitle}> {"<"} </Text>
                </TouchableOpacity>
                <Text style={font_styles.subtitle}> {utils.monthMap[month]} </Text>
                <TouchableOpacity style = {styles.button} onPress={() => setMonth(utils.nextMonth(month))}>
                    <Text style={font_styles.subtitle}> {">"} </Text>
                </TouchableOpacity>
                
                <View style = {styles.separator} />

                <TouchableOpacity style = {styles.button} onPress={() => setYear(utils.prevYear(year))}>
                    <Text style={font_styles.subtitle}> {"<"} </Text>
                </TouchableOpacity>
                <Text style={font_styles.subtitle}> {year} </Text>
                <TouchableOpacity style = {styles.button} onPress={() => setYear(utils.nextYear(year))}>
                    <Text style={font_styles.subtitle}> {">"} </Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.calendarSection}>
                <ScrollView contentContainerStyle={styles.content}>
                    {/* 4 cells wide, up to 8 tall */}
                    {Object.keys(mayOrders).map((day) => (
                        <TouchableOpacity key={day} style = {[styles.cell, , {backgroundColor: determineColor(day)}]} onPress={() => datePressed(day)}>
                            <Text style={[font_styles.dates, {backgroundColor: determineColor(day)}]}> {day + ": "} </Text>
                            <Text style={styles.events}> {+ mayOrders[day].length} items </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style = {styles.dateContent}>
                <ScrollView>
                    <Text style={styles.dateContentTitle}> {"Orders for " + utils.monthMap[month] + " " + day + ", " + year} </Text>
                    {mayOrders[day].length == 0 ?
                        <Text style={styles.dateContentText}> {"No orders for this day"} </Text> :
                        mayOrders[day].map((order) => (
                        <TouchableOpacity key = {"orderWithId" + order.id} style={styles.orderClick} onPress={() => goToOrder(order.id)}>
                            <Text key={day + "info" + order.id } style={styles.dateContentText}> {"-> " + order.name} </Text>
                        </TouchableOpacity>
                        
                        ))}
                </ScrollView>
            </View>
        </View>
    );
}


export default CalendarScreen;