import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';

function HomeScreen(props) {
    
    const goToPage = (page) => {
        console.log("Going to " + page);
        // fetch request for info and pass it along in the params
        props.navigation.push(page);
    }

    const addNewOrder = () => {
        console.log("Adding new order");
        // fetch request for info and pass it along in the params
        props.navigation.push("AddOrderScreen", {editing: false});
    }

    return (
        <View style={styles.container}>
            <View style = {styles.roof}>
                <Text style={font_styles.title}> ROOF </Text>
            </View>

            <View style={styles.middle}>
                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("ViewOrdersScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Orders </Text>
                    </TouchableOpacity>

                    <Image style={styles.windowImage} source={require('../assets/log.png')}/> 
                </View>

                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("CalendarScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Calendar </Text>
                    </TouchableOpacity>

                    <Image style={styles.windowImage} source={require('../assets/log.png')}/> 
                </View>

                {/* <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("CalendarScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Shop </Text>
                    </TouchableOpacity>

                    <Image style={styles.windowImage} source={require('../assets/log.png')}/>  
                </View> */}

                <View style={styles.innerMiddle}>
                    <TouchableOpacity style={styles.innerMiddleButton} onPress={() => goToPage("StatsScreen")}>
                        <Text numberOfLines={2} style={font_styles.windowLabel}> View {'\n'} Stats </Text>
                    </TouchableOpacity>

                    <Image style={styles.windowImage} source={require('../assets/log.png')}/>  
                </View>
                
            </View>


            <TouchableOpacity style = {styles.street} onPress={addNewOrder}>  
                <Text style={font_styles.subtitle}> Add New Order</Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    
    roof: {
        flex: 1.4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: colors.roof_outline,
        backgroundColor: colors.roof_fill,
    },

    middle: {
        flex: 7,
        marginHorizontal: '2.5%',
        // backgroundColor: colors.darker_secondary,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 4,
        borderColor: colors.house_outline,
        borderTopColor : 'transparent',
        borderBottomColor : 'transparent',
        backgroundColor: colors.house_fill,
    },
    
    innerMiddle: {
        flexBasis: '40%',  // so that each inner section takes up 50% of the parent container width
        borderWidth: 3,
        borderColor: colors.window_outline,
        backgroundColor: colors.window_fill,
        borderRadius: 5,
        height: '40%',
        margin: '5%',
    },

    innerMiddleButton : {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    windowImage: {
        flex: 1.5,  
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        marginBottom: 0,
    },

    street: {
        flex: 1.6,
        backgroundColor: colors.darker_secondary,
        borderColor: 'transparent',
        borderTopColor: colors.black,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

  });

export default HomeScreen;