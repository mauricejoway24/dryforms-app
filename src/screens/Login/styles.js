var React = require("react-native");
var { Dimensions } = React;

import commonColor from "../../theme/variables/commonColor";
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight / 2
  },
  logo: {
    height: 50,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20
  },
  loginBtn: {
    marginVertical: 20,
    width: deviceWidth - 100,
    alignSelf: "center",
    backgroundColor: commonColor.btnInfoBg
  },
  loginBtnText: {
    fontSize: 15,
    fontWeight: "500",
    color: commonColor.btnInfoColor
  },
  inputGroup: {
    // borderColor: commonColor.inputBorderColor,
    // borderWidth: 1
  },
  inputIcon: {
    color: commonColor.btnInfoBg
  },
  // noteView: {
  //   marginHorizontal: 30,
  //   bottom: 10
  // },
  // noteText: {
  //   color: commonColor.lightTextColor,
  //   fontSize: 12,
  //   textAlign: "center"
  // }
};
