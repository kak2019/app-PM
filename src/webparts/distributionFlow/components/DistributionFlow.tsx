import * as React from 'react';
import styles from './DistributionFlow.module.scss';
import { IDistributionFlowProps } from './IDistributionFlowProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AppContext from '../../../common/AppContext';
import { Provider } from 'react-redux';
import store from '../../../common/store';
import DistributionFlowView from './DistributionFlowView';

export default class DistributionFlow extends React.Component<IDistributionFlowProps, {}> {
  public render(): React.ReactElement<IDistributionFlowProps> {
    const {
      context
    } = this.props;

    return (
      <AppContext.Provider value={{context}}>
        <Provider store={store}>
          <DistributionFlowView />
        </Provider>
      </AppContext.Provider>
    );
  }
}
