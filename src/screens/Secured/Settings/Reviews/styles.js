var React = require("react-native");
var {
    Dimensions
} = React;

import commonColor from "../../../../theme/variables/commonColor";

export default {
    listView: {
        borderBottomColor: "#D9D5DC",
        flexDirection: 'row',
        borderBottomWidth: 1
    },
    defaultText: {
        textAlign: 'center',
        borderRightWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRightColor: "#D9D5DC",
        backgroundColor: "#f6f6f6",
    },
    defaultCheckBoxWrapper: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f6f6f6',
        paddingTop: 20
    },
    richText: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
};