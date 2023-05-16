import {React, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import colors from '../../config/colors';
import font_styles from '../../config/generics';


function AddOrderScreen(props) {
    
    const [order, setOrder] = useState({
        name: '',
        deliveryDate: '',
        clientContact: '',
        extraNotes: '',
        estimatedCodes: '',
        orderDetails: [],
    });
    
    const handleInputChange = (field, value) => {
        setOrder((prevOrder) => ({
        ...prevOrder,
        [field]: value,
        }));
    };
    
    const addOrderDetail = () => {
        setOrder((prevOrder) => ({
        ...prevOrder,
        orderDetails: [
            ...prevOrder.orderDetails,
            { field1: '', field2: '', field3: '' }, // Replace with your desired fields
        ],
        }));
    };

    const handleOrderDetailChange = (index, field, value) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            orderDetails: prevOrder.orderDetails.map((detail, i) =>
            i === index ? { ...detail, [field]: value } : detail
            ),
        }));
    };
    
    return (
        <View style={styles.container}>

            <View style = {styles.titleBar}>
                <Text style={font_styles.title}> Shop Calendar </Text>
            </View>

            <TextInput
            placeholder="Order Name"
            value={order.name}
            onChangeText={(value) => handleInputChange('name', value)}
            />
            <TextInput
            placeholder="Delivery Date"
            value={order.deliveryDate}
            onChangeText={(value) => handleInputChange('deliveryDate', value)}
            />
            {/* Add more text inputs for other fields */}
    
            {/* Example: Render order details */}
            {order.orderDetails.map((detail, index) => (
            <View key={index}>
                <TextInput
                placeholder="Field 1"
                value={detail.field1}
                onChangeText={(value) =>
                    handleOrderDetailChange(index, 'field1', value)
                }
                />
                <TextInput
                placeholder="Field 2"
                value={detail.field2}
                onChangeText={(value) =>
                    handleOrderDetailChange(index, 'field2', value)
                }
                />
                {/* Add more text inputs for other fields */}
            </View>
            ))}
    
            <Button title="Add Order Detail" onPress={addOrderDetail} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginVertical: 20,
    },

    titleBar: {
        flex: 0.8,
        backgroundColor: colors.primary_default,
        borderBottomWidth: 4,
        borderColor: colors.darker_secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddOrderScreen;