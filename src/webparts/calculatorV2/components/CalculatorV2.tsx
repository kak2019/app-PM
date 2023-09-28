import * as React from 'react';
import { ICalculatorV2Props } from './ICalculatorV2Props';
import AppContext from '../../../common/AppContext';
import { Provider } from "react-redux";
import store from '../../../common/store';
//import CaculateView from './CalculatorView';
import CaculateBundleView from './DialogCalcaulator';
export default class CalculatorV2 extends React.Component<ICalculatorV2Props, {}> {
  public render(): React.ReactElement<ICalculatorV2Props> {
    const { context } = this.props;
    return (
      <AppContext.Provider value={{ context }}>
        <Provider store={store}>
        <CaculateBundleView/>
        </Provider>
        
      </AppContext.Provider>
    );
  }
}
