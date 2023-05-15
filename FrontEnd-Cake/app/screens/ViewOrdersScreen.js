import { React } from 'react';
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
        }
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
    

    return (
        <View style={styles.container}>

            <View style = {styles.half}>
                <View style = {styles.titleBar}>
                    <Text style={font_styles.title}> Live Orders </Text>
                </View>
                <View style = {styles.content}>
                    <ScrollView>
                            <View style={styles.headingLine}>
                                <Text style={styles.headingContent}> Order Name </Text>
                                <Text style={styles.headingContent}> Days Left </Text>
                            </View>
                        {liveOrders.map((item, index) => (
                            <TouchableOpacity key={index} style = {styles.contentLine} onPress={() => console.log("Onto this Current order")}>
                                <Text style={styles.innerContent}> {item.name}</Text>
                                <Text style={styles.innerContent}> {item.daysLeft} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
                            <TouchableOpacity key={index} style = {styles.contentLine} onPress={() => console.log("Onto this Past order")}>
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.primary_default,
        backgroundColor: colors.secondary,
        marginBottom: 15,
    },

    headingLine: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 3,
        borderColor: colors.primary_default,
        marginBottom: 15,
    },

    headingContent: {
        flex: 1,
        fontSize: 16,
        fontWeight : "bold",
        color: colors.black,
        textAlign: "center",
    },

    innerContent: {
        flex: 1,
        fontSize: 16,
        fontWeight: "normal",
        color: colors.black,
        textAlign: "center",
    },

});

export default ViewOrdersScreen;