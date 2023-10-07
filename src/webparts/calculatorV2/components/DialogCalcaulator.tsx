import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
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
const modalPropsStyles = { main: { maxWidth: 800 } };
const dialogContentProps = {
  type: DialogType.normal,
  title: '',
  subText: '',
};

//<Dialog><div>看到就是成功</div></Dialog>

export default function  dialogCalculator(): JSX.Element {
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
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
      <Toggle label="Is draggable" onChange={toggleIsDraggable} checked={isDraggable} />
      <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Open Dialog" />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
       
      >
         {/* <div>能看到吗</div> */}
         <CaculateBundleView/>
        <DialogFooter>
          <PrimaryButton onClick={toggleHideDialog} text="Send" />
          <DefaultButton onClick={toggleHideDialog} text="Don't send" />
        </DialogFooter>
      </Dialog>
    </>
}