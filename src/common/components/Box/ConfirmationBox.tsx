import * as React from "react";
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react";

interface IConfirmationBoxProps {
  isOpen: boolean;
  confirmationDetails: { title: string; subTitle: string };
  confirmationNoCallback: () => void;
  confirmationYesCallback: () => void;
  onDismiss: () => void;
}
//#region =========== Properties of the dialog============
const modalPropsStyles = { main: { maxWidth: 450 } };
export const modalProps = {
  isBlocking: true,
  styles: modalPropsStyles,
};

//#endregion

export const ConfirmationBox = (props: IConfirmationBoxProps): JSX.Element => {
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
};
