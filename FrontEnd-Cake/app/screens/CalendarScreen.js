import { React, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';

function CalendarScreen(props) {

    // for month-year handler
    const [month, setMonth] = useState(new Date().getMonth()); // [0, 11] 
    const [year, setYear] = useState(new Date().getFullYear());  // XXXX

    const mayOrders = {  // youd get this in a per month basis
        1: [  // key is the day of the month
            {
                id: 17,
                name: "John's Son Minion Birthday Cake and cookies",
            },
            {
                id: 18,
                name: "Jane's baptism Cupcakes",
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
        10:[],
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

    console.log(mayOrders[1]);


    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> Shop Calendar </Text>
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

            <View style = {styles.content}>
                <ScrollView>
                    {/* 4 cells wide, up to 8 tall */}
                    {Object.keys(mayOrders).map((day) => (
                        <View key={day} style = {styles.cell}>
                            <Text style={font_styles.subtitle}> {day} </Text>
                        </View>
                    ))}
                </ScrollView>
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

    controlBar: {
        flex: 1.25,
        flexDirection: 'row',
        backgroundColor: colors.primary_default,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        // borderTopWidth: 4,
        borderBottomWidth: 4,
        borderColor: colors.darker_secondary,
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

    cell: {
        flex: 1,
        borderWidth: 1,
    },

    innerContent: {
        flex: 1,
        fontSize: 16,
        fontWeight: "normal",
        color: colors.black,
        textAlign: "center",
    },

});

export default CalendarScreen;