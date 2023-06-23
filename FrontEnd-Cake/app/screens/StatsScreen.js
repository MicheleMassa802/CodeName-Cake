import { React, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';                                                                      
import colors from '../../config/colors';
import font_styles from '../../config/generics';
import utils from '../../config/calendarUtil';


function StatsScreen(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;

    console.log("Params inherited: ", JSON.stringify(upperParams));
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            marginVertical: 20,
        },
    
        top: {
            flex: 1.75,
            backgroundColor: colors.secondary,
            alignContent: 'center',
            justifyContent: 'center',
    
        },
    
        controlBar: {
            flex: 1.25,
            flexDirection: 'row',
            backgroundColor: colorway,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            borderTopWidth: 4,
            borderBottomWidth: 4,
            borderColor: colors.darker_secondary,
        },
    
        content: {
            flex: 7,
            // backgroundColor: colors.secondary,
            margin: 20,
        },
    
        innerContent: {
            flex: 1,
            fontSize: 16,
            fontWeight: "normal",
            color: colors.black,
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
    
    });

    const [month, setMonth] = useState(new Date().getMonth()); // [0, 11] 
    const [year, setYear] = useState(new Date().getFullYear());  // XXXX
    
    const content = {
        ordersCompleted: 10,
        mostPopularOrderType: "Cake",
        biggestOrder: "$360",
        totalRegisteredOrderIncome: "$2100",
        businessLevel: 102,
        possibleRepeats: [
            {
                name: "John Doe",
                order: "Cake",
                date: "12/12/2020",
                price: "$160"
            },
            {
                name: "Jane Doe",
                order: "Cake",
                date: "12/12/2020",
                price: "$185"
            },
        ],
    }


    return (
        <View style={styles.container}>

            <View style = {styles.top}>
                <Text numberOfLines={2} style={font_styles.title}> {upperParams.shopName}'s Statistics </Text>
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
                    <Text style={styles.innerContent}> -Orders Completed: {content.ordersCompleted} </Text>
                    <Text style={styles.innerContent}> -Business Level: {content.businessLevel} </Text>
                    <Text style={styles.innerContent}> -Most Popular Order Type: {content.mostPopularOrderType} </Text>
                    <Text style={styles.innerContent}> -Biggest Order: {content.biggestOrder} </Text>
                    <Text style={styles.innerContent}> -Total Registered Order Income: {content.totalRegisteredOrderIncome} </Text>
                    <Text style={styles.innerContent}> -Possible Repeats: </Text>

                    {content.possibleRepeats.map((item, index) => (
                        <Text key={index} style={styles.innerContent}> {'--> ' + item.name + ': '} {item.order + ' -- '} {item.date + ' -- '} {item.price} </Text>
                    ))}
                </ScrollView>
            </View>

        </View>
    );
}

export default StatsScreen;