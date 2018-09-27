import React, { Component } from "react";
import { Provider } from "react-redux";
import { StyleProvider } from "native-base";
import Parent from "../Parent";
import configureStore from "./configureStore";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: true }))
    };
  }

  render() {
    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={this.state.store}>
          <Parent />
        </Provider>
      </StyleProvider>
    );
  }
}
