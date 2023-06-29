import { React, useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import BASE_URL from '../../config/network';
import utils from '../../config/calendarUtil';

function ViewOrdersScreen(props) {
    
    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

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
            backgroundColor: colorway,
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
            borderColor: colorway,
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
            borderColor: colorway,
            marginBottom: 15,
        },
    
        headingContent: {
            flex: 1,
            fontSize: 16,
            fontWeight : "bold",
            color: colors.black,
            textAlign: "center",
            justifyContent: 'center',
            alignContent: 'center',
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
            borderColor: colorway,
        },
    
        lineSelect: {
            flex: 0.12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
        },
    
        innerCheckbox: {
            flex: 1,
            backgroundColor: colorway,
        },
    
        button: {
            // flex: 0.2,
            width: '20%',
            backgroundColor: colorway,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            // marginVertical: 7,
            borderWidth: 1,
            borderColor: colors.darker_secondary,
            marginLeft: '5%',
    
        },
    
    
    });

    const [orderContent, setOrderContent] = useState([]);  // full orders list
    const [liveOrderViewer, setLiveOrderViewer] = useState([]); // list of watered down orders to be displayed
    const [pastOrderViewer, setPastOrderViewer] = useState([]); // list of watered down orders to be displayed


    const getOrderContent = async () => {
        // fetch request to get the order content
        const endpoint = "orders/getRelevantShopOrders/" + upperParams.shopId;

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
                const data = await getOrderContent();
                setOrderContent(data);  // set full orders list
                // transform to good format and set past and live orders (first 5 elements and last 10 respectively)
                setPastOrderViewer(transformOrderFormat(data.slice(0, 5), false));
                setLiveOrderViewer(transformOrderFormat(data.slice(5, 15), true));
                
            } catch (error) {
                alert("Error fetching orders for " + upperParams.shopName);
                console.log(error);
            }
        }

        fetchData();
    }, []);


    const transformOrderFormat = (orders, live) => {
        // transform each order object to just an object with its id, name, daysLeft/dateDelivered depending on the value of live 
        const transformed = [];

        orders.forEach(order => {
            // check first if order is empty
            if (order.length === 0) {
                // skip this order (go to next one)
                return;
            }

            if (live) {
                const today = new Date(utils.getTodaysDate());
                const orderDate = new Date(order[0].basic.deliveryDate);
                const timeDiff = Math.ceil((orderDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

                transformed.push({
                    id: order[0].basic.orderId,
                    name: order[0].basic.orderName,
                    toDeliver: "" + order[0].basic.deliveryDate + " (" + timeDiff + "day(s) left)",
                });
            } else {
                transformed.push({
                    id: order[0].basic.orderId,
                    name: order[0].basic.orderName,
                    delivered: order[0].basic.deliveryDate,
                });
            }
        });

        return transformed;
    }

    const [selectedOrders, setSelectedOrders] = useState([]);  // to store the indeces into liveOrders that are selected
    
    const addSelectedOrder = (index) => {
        if (selectedOrders.includes(index)) {
            // remove the index from the array
            const indicesToKeep = selectedOrders.filter((item) => item !== index);
            setSelectedOrders(indicesToKeep);
        } else if (selectedOrders.length === 2) {
            // alert the user that they can only select 2 orders
            alert("You can only select 2 orders to merge. Unselect one to select another.");
        } else {
            // add the index to the array
            setSelectedOrders([...selectedOrders, index]);
        }
    }

    const goToOrder = (orderId) => {
        // go to the order screen with the selected orders
        console.log("Going to order: ", orderId);
        let orderToGoTo = findOrderBody(orderId);
        props.navigation.push("ViewReceiptScreen", {
            ...upperParams,
            orderId: orderId,
            orderObject: orderToGoTo,
            chainPosition: 0,  // start of order chain
        });
    }

    const findOrderBody = (orderId) => {
        let orderBody = null;

        for(let i = 0; i < orderContent.length; i++) {
            const order = orderContent[i];

            if (order.length === 0) {
                // skip this order (go to next one)
                continue;
            }
            
            // otw

            if (order[0].basic.orderId === orderId) {
                orderBody = order;
                break;
            }
        };

        return orderBody;

    }

    const mergeOrders = () => {
        
        // get the orderIds of the selected orders
        const order1Id = liveOrderViewer[selectedOrders[0]].id;
        const order2Id = liveOrderViewer[selectedOrders[1]].id;
        alert(`The merged orders will now fall under the date of the first order selected: ${liveOrderViewer[selectedOrders[0]].toDeliver}`);

        // fetch request to merge the orders
        const endpoint = "orders/merge/" + order1Id + "/" + order2Id;
        

        // config vars
        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const options = {
            method: 'POST',
            headers: headers,
        };

        fetch(BASE_URL + endpoint, options)
            .then(response => {
                if (response.status === 403) {
                    alert("You are not authorized to perform this action.");
                    return;
                }
                console.log("Orders successfully merged");
            })
            // no data returned from the merge request
            .catch(error => {
                console.log(error);
                alert("Error merging orders: " + error);
        });

        // after the merge, send back to home screen
        props.navigation.popToTop();
        props.navigation.push("HomeScreen", {
            userId: upperParams.userId,
            shopId: upperParams.shopId,
            shopName: upperParams.shopName,
            colorway: upperParams.colorway,
            token: upperParams.token
        })

    }


    const transformSelectedIndecesIntoObjects = () => {
        // transform the indeces into objects
        const selectedObjects = [];
        selectedOrders.forEach((index) => {
            selectedObjects.push(liveOrderViewer[index].name);
        });
        return selectedObjects;
    }

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
                            <Text style={styles.headingContent}> Due Date </Text>
                        </View>
                        {selectedOrders.length > 1 &&
                            <TouchableOpacity style = {styles.button} onPress={mergeOrders}>
                                <Text style={font_styles.smallBody}> Merge </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    
                    <View style={{flex: 4}}>
                        <ScrollView>

                            {liveOrderViewer.map((item, index) => (
                                <View key={item.id} style={styles.lineSelect}>
                                    <TouchableOpacity style = {[styles.contentLine, {width: '80%'}]} onPress={() => goToOrder(item.id)}>
                                        <Text style={styles.innerContent}> {item.name}</Text>
                                        <Text style={styles.innerContent}> {item.toDeliver} </Text>
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
                        {pastOrderViewer.map((item, index) => (
                            <TouchableOpacity key={item.id} style = {styles.contentLine} onPress={() => goToOrder(item.id)}>
                                <Text style={styles.innerContent}> {item.name}</Text>
                                <Text style={styles.innerContent}> {item.delivered} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

        </View>
    );
}


export default ViewOrdersScreen;