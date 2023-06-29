import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';
import BASE_URL from '../../config/network';

function CalendarScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

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
    const [orderContent, setOrderContent] = useState([]);  // full orders list
    const [calendarContent, setCalendarContent] = useState(utils.getEmptyCalendar(year, month));  // dictionary of day: [watered down orders]


    const getCalendarContent = async () => {

        let term;
        if (month < 9) {
            term = "0" + (month + 1) + "-" + year;
        } else {
            term = (month + 1) + "-" + year;
        }
        const endpoint = "orders/getShopTermOrders/" + upperParams.shopId + "/" + term;
    

        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const options = {
            method: 'GET',
            headers: headers,
        };

        const response = await fetch(BASE_URL + endpoint, options);
        const data = await response.json();

        return data;
    }

    // fetch content when component mounts and when month or year changes
    useEffect(() => {
        const fetchData = async () => {

            try {
                const data = await getCalendarContent();
                setOrderContent(data);  // set full orders list
                setCalendarContent(transformOrderFormat(data));  // transform to good format and set
            } catch (error) {
                alert("Error fetching orders for " + upperParams.shopName + " during the period " + month + "-" + year);
                console.log(error);
            }
        }

        fetchData();
    }, [month, year]);


    const transformOrderFormat = (orders) => {
        // start with an empty calendar
        const transformed = utils.getEmptyCalendar(year, month); 
        // for each order within the requested term, get the day, and add an object made up of its id and name
        // to the transformed dictionary

        orders.forEach(order => {
            // order is a chain of orders in a list, so get the first one
            let day = order[0].basic.deliveryDate.split("-")[2];
            // trim the leading 0 if there is one
            if (day[0] === "0") {
                day = day[1];
            }

            const orderObject = {
                indexIntoOrders: orders.indexOf(order),  // to pass the order object to the order screen
                id: order[0].basic.orderId,
                name: order[0].basic.orderName,
            }
            // push object at its corresponding day's list
            transformed[day].push(orderObject);
        });

        return transformed;
    }

    const datePressed = (date) => {
        setDay(date);
    }

    const determineColor = (date) => {
        if (calendarContent[date].length == 0) {
            return colors.green;
        } else if (calendarContent[date].length < 2) {
            return colors.yellow;
        } else if (calendarContent[date].length < 4) {
            return colors.orange;
        } else {
            return colors.red;
        }
    }

    const goToOrder = (orderId, indexIntoOrders) => {
        // go to the order screen with the selected orders
        console.log("Going to order: ", orderId);
        props.navigation.push("ViewReceiptScreen", {
            ...upperParams,
            orderId: orderId,
            orderObject: orderContent[indexIntoOrders],
            chainPosition: 0,  // start of order chain
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
                    {Object.keys(calendarContent).map((day) => (
                        <TouchableOpacity key={day} style = {[styles.cell, , {backgroundColor: determineColor(day)}]} onPress={() => datePressed(day)}>
                            <Text style={[font_styles.dates, {backgroundColor: determineColor(day)}]}> {day + ": "} </Text>
                            <Text style={styles.events}> {+ calendarContent[day].length} items </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style = {styles.dateContent}>
                <ScrollView>
                    <Text style={styles.dateContentTitle}> {"Orders for " + utils.monthMap[month] + " " + day + ", " + year} </Text>
                    {calendarContent[day].length == 0 ?
                        <Text style={styles.dateContentText}> {"No orders for this day"} </Text> :
                        calendarContent[day].map((order) => (
                        <TouchableOpacity key = {"orderWithId" + order.id} style={styles.orderClick} onPress={() => goToOrder(order.id, order.indexIntoOrders)}>
                            <Text key={day + "info" + order.id } style={styles.dateContentText}> {"-> " + order.name} </Text>
                        </TouchableOpacity>
                        
                        ))}
                </ScrollView>
            </View>
        </View>
    );
}


export default CalendarScreen;