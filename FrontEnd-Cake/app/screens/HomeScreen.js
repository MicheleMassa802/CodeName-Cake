import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';


// let colorway;


function HomeScreen(props) {
    
    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
        },
        
        titleBar: {
            flex: 1,
            backgroundColor: colorway,
            borderBottomWidth: 4,
            borderColor: colors.darker_secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
    
        middle: {
            flex: 7,
            marginHorizontal: '2.5%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderTopColor : 'transparent',
            borderBottomColor : 'transparent',
        },
        
        innerMiddle: {
            flexBasis: '40%',  // so that each inner section takes up 50% of the parent container width
            borderWidth: 5,
            borderColor: colorway,
            backgroundColor: colors.secondary,
            borderRadius: 20,
            height: '40%',
            margin: '5%',
        },
    
        innerMiddleButton : {
            flex: 3,
            alignItems: 'center',
            justifyContent: 'center',
        },
    
        bottom: {
            flex: 1.6,
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


    const goToPage = (page) => {
        console.log("Going to " + page);
        // fetch request for info and pass it along in the params
        props.navigation.push(page, {
            ...upperParams,
        });
    }

    const addNewOrder = () => {
        console.log("Adding new order");
        // fetch request for info and pass it along in the params
        props.navigation.push("AddOrderScreen", {
            ...upperParams,
            editing: false
        });
    }

    return (
        <View style={styles.container}>
            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> {upperParams.shopName} </Text>
            </View>

            <View style={styles.middle}>
                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("ViewOrdersScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Orders </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("CalendarScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Calendar </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("StatsScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Stats </Text>
                    </TouchableOpacity>
                </View>
                
            </View>


            <TouchableOpacity style = {styles.bottom} onPress={addNewOrder}>  
                <Text style={font_styles.subtitle}> ADD NEW ORDER</Text>
            </TouchableOpacity>

        </View>
    );
}




export default HomeScreen;