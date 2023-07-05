import * as React from 'react';
import { IRequestFlowProps } from './IRequestFlowProps';
import RequestView from '../components/Requestview';
import AppContext from '../../../common/AppContext';
import { Provider } from "react-redux";
import store from '../../../common/store';
export default class RequestFlow extends React.Component<IRequestFlowProps, {}> {
  public render(): React.ReactElement<IRequestFlowProps> {
    const { context } = this.props;

    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
        <RequestView />
        </Provider>
        
      </AppContext.Provider>
      
    );
  }
}
