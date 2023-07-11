import * as React from 'react';
import { memo } from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react';
import { modalProps } from './ConfirmationBox';

interface ISuccessConfirmationBoxProps{
    isOpen:boolean;
    message:string;
    onDismiss:()=>void;

}
export default memo(function SuccessConfirmationBox(props:ISuccessConfirmationBoxProps) {
    const {isOpen,message,onDismiss}=props;
  return (
    <Dialog
        hidden={isOpen}
        onDismiss={onDismiss}
        dialogContentProps={{
          type: DialogType.normal,
          title: "All went well",
        }}
        modalProps={modalProps}
      >
        <MessageBar messageBarType={MessageBarType.success} isMultiline={true}>
          {message}
        </MessageBar>
        <DialogFooter>
          <DefaultButton onClick={onDismiss} text="OK" />
        </DialogFooter>
      </Dialog>
  )
})
