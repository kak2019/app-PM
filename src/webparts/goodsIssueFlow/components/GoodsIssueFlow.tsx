import * as React from "react";
import { Provider } from "react-redux";
import { IGoodsIssueFlowProps } from "./IGoodsIssueFlowProps";
import store from '../../../common/store';
import App from './App';
import AppContext from "../../../common/AppContext";


export default class GoodsIssueFlow extends React.Component<
  IGoodsIssueFlowProps,
  {}
> {
  public render(): React.ReactElement<IGoodsIssueFlowProps> {
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
