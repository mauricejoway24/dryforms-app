import React, {
  Component
} from "react";
import {
  connect
} from 'react-redux';
import {
  Image,
  StatusBar,
  Platform
} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  View,
  Item,
  Input,
  Icon
} from "native-base";
import styles from "./styles"
import commonColor from "../../theme/variables/commonColor"
import {
  login
} from '../../service/auth'
import {
  loginAttempt
} from '../../actions/auth'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      email: 'admin@gmail.com',
      password: 'qwerty123',
      isEmailValidate: true,
      isPasswordValidate: true,
    }

    this.validate = this.validate.bind(this)
    this.userLogin = this.userLogin.bind(this);
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar
          backgroundColor={
            Platform.OS === "android"
              ? commonColor.statusBarColor
              : "transparent"
          }
          barStyle="dark-content"
        />
        <Content scrollEnabled={false}>
          <View style={styles.logoContainer}>
            <Image resizeMode="contain" style={styles.logo} source={require('../../../assets/logo.png')} />
          </View>
          <View style={styles.formContainer}>
            <Item style={styles.inputGroup} error={this.state.isEmailValidate ? false : true}>
              <Icon name="ios-person" style={styles.inputIcon} />
              <Input
                onChangeText={(text) => this.validate(text, 'email')}
                value={this.state.email}
                placeholder={"Email Address"} />
            </Item>
            <Item style={styles.inputGroup} error={this.state.isPasswordValidate ? false : true}>
              <Icon name="ios-unlock" style={styles.inputIcon} />
              <Input
                onChangeText={(text) => this.validate(text, 'password')}
                value={this.state.password}
                secureTextEntry={true}
                placeholder={"Password"} />
            </Item>
            <Button
              block
              rounded
              style={styles.loginBtn}
              onPress={(e) => this.userLogin(e)}
            >
              <Text style={styles.loginBtnText}>LOG IN</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  validate(text, type) {
    if (type === 'email') {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text)) {
        this.setState({
          isEmailValidate: true
        })
      } else {
        this.setState({
          isEmailValidate: false
        })
      }
      this.setState({
        email: text
      })
    } else if (type === 'password') {
      let reg = /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/;
      if (reg.test(text)) {
        this.setState({
          isPasswordValidate: true
        })
      } else {
        this.setState({
          isPasswordValidate: false
        })
      }
      this.setState({
        password: text
      })
    }
  }

  userLogin(e) {
    if (!this.state.email) this.setState({
      isEmailValidate: false
    })
    if (!this.state.password) this.setState({
      isPasswordValidate: false
    })
    if (!this.state.isEmailValidate || !this.state.isPasswordValidate) return

    this.props.loginAttempt(this.state)
    this.props.onLogin(this.state)

    e.preventDefault();
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    isLoggingIn: state.auth.isLoggingIn,
    error: state.auth.error,
    token: state.auth.token
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (userData) => {
      dispatch(login(userData))
    },
    loginAttempt: (userData) => {
      dispatch(loginAttempt(userData))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);