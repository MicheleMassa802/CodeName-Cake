import { React, useState, useEffect } from 'react';
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

    const [content, setContent] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() - 1); // [0, 11] 
    const [year, setYear] = useState(new Date().getFullYear());  // XXXX

    const getStatsContent = async () => {
        
        let term;
        if (month < 9) {
            term = "0" + (month + 1) + "-" + year;
        } else {
            term = (month + 1) + "-" + year;
        }
        const baseUrl = "http://192.168.0.113:8080/api/dev/";
        const endpoint = "shopStats/" + upperParams.shopId + "/" + term;
        console.log(`Fetching stats for ${upperParams.shopName} during the period ${term}`);
        const headers = {
            Authorization: `Bearer ${upperParams.token}`,
            'Content-Type': 'application/json'
        };

        const options = {
            method: 'GET',
            headers: headers,
        };

        const response = await fetch(baseUrl + endpoint, options);
        const data = await response.json();
        console.log("Stats data: ", data);

        return data;
    }

    // fetch content when component mounts
    useEffect(() => {
        const fetchData = async () => {

            // only perform for past month-year combinations
            const currentDate = new Date();
            
            if (
                (year < currentDate.getFullYear()) || 
                (year == currentDate.getFullYear() && month < (currentDate.getMonth()))
            ) {
                try {
                    const data = await getStatsContent();
                    setContent(data);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setContent(null);
            }
            
        };

        fetchData();
    }, [month, year]);

    // getStatsContent();  // call the function to get the content at the beginning of the render

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
                {(!content &&
                <Text style={styles.innerContent}> No stats available for this term as stats cannot be calculated until
                the term you have selected has ended. </Text>)}

                {(content && content.ordersCompletedLength === 0 &&
                <Text style={styles.innerContent}> No stats available as you have no recorded orders for this
                term. </Text>)}

                {(content && content.ordersCompletedLength > 0 &&
                <ScrollView>
                    <Text style={styles.innerContent}> - Term: {content.basic.term} </Text>
                    <Text style={styles.innerContent}> - Orders Completed: {content.ordersCompletedLength} </Text>
                    <Text style={styles.innerContent}> - Business Level: {content.basic.businessLevel} </Text>
                    <Text style={styles.innerContent}> - Most Popular Order Type: {content.basic.popularOrderType} </Text>
                    <Text style={styles.innerContent}> - Biggest Order: {content.basic.biggestOrder} </Text>
                    <Text style={styles.innerContent}> - Total Registered Order Income: {content.basic.totalOrderIncome} </Text>
                </ScrollView>)}
            </View>

        </View>
    );
}

export default StatsScreen;