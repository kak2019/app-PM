import * as React from 'react';
import { IHomePageProps } from './IHomePageProps';
import HomePageView from './HomeView';
export default class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
    
    return (
    
      <HomePageView />
    );
  }
}
