import * as React from "react";
import {memo } from "react";
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react";
import { modalProps } from "./common";

interface IConfirmationBoxProps {
  isOpen: boolean;
  confirmationDetails: { title: string; subTitle: string };
  confirmationNoCallback: () => void;
  confirmationYesCallback: () => void;
  onDismiss: () => void;
}
export default memo(function ConfirmationBox (props: IConfirmationBoxProps): JSX.Element {
  const {
    isOpen,
    confirmationDetails,
    confirmationYesCallback,
    confirmationNoCallback,
    onDismiss,
  } = props;
  return (
    <Dialog
      hidden={isOpen}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: confirmationDetails.title,
        subText: confirmationDetails.subTitle,
      }}
      modalProps={modalProps}
    >
      <DialogFooter>
        <PrimaryButton onClick={confirmationYesCallback} text="Yes" />
        <DefaultButton onClick={confirmationNoCallback} text="No" />
      </DialogFooter>
    </Dialog>
  );
});
