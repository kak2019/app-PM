import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import {  DefaultButton } from '@fluentui/react/lib/Button';
import { ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { useBoolean } from '@fluentui/react-hooks';
import * as React from 'react';
import CaculateBundleView from './CalculatorView';
const dragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
};
const modalPropsStyles = { main: {selectors: {
    '@media (min-width: 0px)': {
      //height: 500,
      //maxHeight: '60vh',
      maxWidth: 900,
      minwidth: 900,
        width: 900,
    }
  }, }};
const dialogContentProps = {
  type: DialogType.normal,
  title: '',
  subText: '',
};

//<Dialog><div>看到就是成功</div></Dialog>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function  dialogCalculator({showDialog, toggleHideDialog, row}: {row?: any, showDialog?: boolean,toggleHideDialog?: (ev?: React.MouseEvent<HTMLButtonElement>) => any}): JSX.Element {
    //const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);
    const modalProps = React.useMemo(
      () => ({
        isBlocking: true,
        styles: modalPropsStyles,
        dragOptions: isDraggable ? dragOptions : undefined,
      }),
      [isDraggable],
    )
    return <>
      <Toggle label="" onChange={toggleIsDraggable} checked={isDraggable}  style={{display:"none"}}/>
      <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Open Dialog"  style={{display:"none"}}/>
      <Dialog
        hidden={!showDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
       
      >
         {/* <div>能看到吗</div> */}
         {/* 模拟有数据的id */}
         {/* <CaculateBundleView row={{...row, PartID: '10026'}}/> */}
         {showDialog&&<CaculateBundleView row={row}/>}
         {/* <CaculateBundleView/> */}
        {/* <DialogFooter>
          <PrimaryButton onClick={toggleHideDialog} text="Send" />
          <DefaultButton onClick={toggleHideDialog} text="Don't send" />
        </DialogFooter> */}
      </Dialog>
    </>
}