import * as React from "react";
import { Provider } from "react-redux";
import { IDistributionFlowTrackerProps } from './IDistributionFlowTrackerProps';
import store from '../../../common/store';
import App from './App';
import AppContext from "../../../common/AppContext";

export default class DistributionFlowTracker extends React.Component<IDistributionFlowTrackerProps, {}> {
  public render(): React.ReactElement<IDistributionFlowTrackerProps> {
    const { context } = this.props;

    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContext.Provider>
    )
  }
}
