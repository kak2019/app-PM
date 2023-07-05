import * as React from 'react';
import { IHomePageProps } from './IHomePageProps';
import HomePageView from './HomeView';
import AppContext from '../../../common/AppContext';
import { Provider } from "react-redux";
import store from '../../../common/store';
export default class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    const { context } = this.props;
    return (
      <AppContext.Provider value={{ context }}>
      <Provider store={store}>
      <HomePageView />
      </Provider>
        
      </AppContext.Provider>
    );
  }
}
