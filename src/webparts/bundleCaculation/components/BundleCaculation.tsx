import * as React from 'react';

import { IBundleCaculationProps } from './IBundleCaculationProps';
import AppContext from '../../../common/AppContext';
import { Provider } from "react-redux";
import store from '../../../common/store';
import CaculateView from './BundleCaculationView';
export default class BundleCaculation extends React.Component<IBundleCaculationProps, {}> {
  public render(): React.ReactElement<IBundleCaculationProps> {
  
    const { context } = this.props;
    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
        <CaculateView />
        </Provider>
        
      </AppContext.Provider>
    );
  }
}
