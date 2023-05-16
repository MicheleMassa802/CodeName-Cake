import { StyleSheet } from 'react-native';
import colors from './colors';

const font_styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        // fontFamily: "Inconsolata",
        textAlign: "center",
        
    },

    subtitle: {
        fontSize: 22,
        fontWeight: "bold",
        // fontFamily: "Inconsolata",
        textAlign: "center",
    },

    body: {
        fontSize: 16,
        fontWeight: "normal",
        // fontFamily: "Inconsolata",
    },

    bodyCenter: {
        fontSize: 16,
        fontWeight: "normal",
        // fontFamily: "Inconsolata",
        textAlign: "center",
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10, // equivalent to margin: 10px 0px 10px 0px
        // fontFamily: "Inconsolata",
    },

    input: {
        borderWidth: 1,
        borderColor: colors.darker_secondary,
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
    },

    windowLabel: {
        fontSize: 22,
        fontWeight: "bold",
        // fontFamily: "Inconsolata",
        textAlign: "center",
        color: colors.darker_secondary,

    },

    dates: {
        fontSize: 18,
        fontWeight: "bold",
        // fontFamily: "Inconsolata",
        backgroundColor: colors.secondary,
    },
    
});

export default font_styles;