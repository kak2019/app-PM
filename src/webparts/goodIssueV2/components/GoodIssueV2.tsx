import * as React from 'react';

import { IGoodIssueV2Props } from './IGoodIssueV2Props';
import store from '../../../common/store';
import App from './App';
import AppContext from "../../../common/AppContext";
import { Provider } from "react-redux";

export default class GoodIssueV2 extends React.Component<IGoodIssueV2Props, {}> {
  public render(): React.ReactElement<IGoodIssueV2Props> {

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
