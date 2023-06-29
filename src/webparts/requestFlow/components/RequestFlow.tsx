import * as React from 'react';
import { IRequestFlowProps } from './IRequestFlowProps';
import RequestView from '../components/Requestview';
export default class RequestFlow extends React.Component<IRequestFlowProps, {}> {
  public render(): React.ReactElement<IRequestFlowProps> {
   
    return (
      <RequestView/>
    );
  }
}
