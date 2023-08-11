import * as React from 'react';
import { IOnelinesentenceProps } from './IOnelinesentenceProps';
import { Provider } from "react-redux";
import store from "../../../common/store";
import AppContext from "../../../common/AppContext";
import App from "./App"
export default class Onelinesentence extends React.Component<IOnelinesentenceProps, {}> {
  
  public render(): React.ReactElement<IOnelinesentenceProps> {
    const { context } = this.props;

    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContext.Provider>
    );
  }
}
