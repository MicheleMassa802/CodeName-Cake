import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';  
import colors from '../../config/colors';
import font_styles from '../../config/generics';

function UpdateOrderChain(props) {

    const upperParams = props.route.params;
    const colorway = upperParams.colorway;
    const orderObject = upperParams.orderObject;  // the order object to be displayed

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            marginVertical: 20,
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
            flex: 5,
            margin: 20,
        },

    });

    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={font_styles.title}>Updating Order {upperParams.orderId} </Text>
            </View>
            <ScrollView style={styles.content}>
                <Text style={font_styles.body}>This is the Update Order Chain Screen</Text>
            </ScrollView>
        </View>
    );
}

export default UpdateOrderChain;