import { useFormikContext } from "formik";
import {
  DefaultButton,
  DialogFooter,
  DialogType,
  PrimaryButton,
} from "office-ui-fabric-react";
import * as React from "react";
import { IRequestGIError, IRequestListItem } from "../../../../common/model";
import { useRequests } from "../../../../common/hooks/useRequests";
import { useState } from "react";
import { AnimatedDialog } from "@pnp/spfx-controls-react/lib/AnimatedDialog";
import { useEntities } from "../../../../common/hooks";
import { IPrincipal } from "@pnp/spfx-controls-react";
import { Dialog } from "@microsoft/sp-dialog";

interface IResetAction {
  disabled: boolean;
  idx: number;
}
interface IFormValues {
  formlvItems: IRequestListItem[];
}
interface IFormErrors {
  formlvItems?: IRequestGIError[];
}
export default function SubmitAction({
  disabled,
  idx,
}: IResetAction): JSX.Element {
  const { values, errors } = useFormikContext();
  const [, , , , myEntity, , ,] = useEntities();
  const [
    ,
    ,
    ,
    ,
    ,
    requestTermialId,
    ,
    fetchRequestsByTermialId,
    ,
    ,
    ,
    changeRequestId,
    ,
    editRequest,
  ] = useRequests();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimatedDialog, setShowAnimatedDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const rowValues = (values as IFormValues).formlvItems[idx];
    const rowErrors = (errors as IFormErrors).formlvItems?.slice(idx,1)[0] || {} as IRequestGIError;
    let isValidRow = false;
    isValidRow = !(
      rowErrors.HowMuchCanBeFullfilled?.length > 0 ||
      rowErrors.QtySent?.length > 0
    );

    if (!isValidRow) return;

    setIsSubmitting(true);

    changeRequestId(rowValues.ID);
    if (rowValues.Status === "GI / In Transit" && isConfirmed === false) {
      setShowAnimatedDialog(true);
      return;
    }
    const request = {
      ID: rowValues.ID,
      HowMuchCanBeFullfilled:
        rowValues.HowMuchCanBeFullfilled.toString() === ""
          ? null
          : rowValues.HowMuchCanBeFullfilled.toString(),
      Status: rowValues.Status,
      FullOrPartialFilled: rowValues.FullOrPartialFilled,
      QtySent:
        rowValues.QtySent.toString() === ""
          ? null
          : rowValues.QtySent.toString(),
      DateByWhenItWillReach:
        rowValues.DateByWhenItWillReach.toString() === ""
          ? null
          : new Date(rowValues.DateByWhenItWillReach.toString()).toISOString(),
      ConfirmationFromSupplier: rowValues.ConfirmationFromSupplier,
      Field1: rowValues.Field1,
      Field2: rowValues.Field2,
      StatusUpdateById: (
        JSON.parse(myEntity.Users)[0] as IPrincipal
      ).id.toString(),
    };
    await editRequest({ request });
    fetchRequestsByTermialId(requestTermialId);
    setIsSubmitting(false);
    await Dialog.alert(
      `Data you inputed in request ${rowValues.RequestNumber} saved successfully`
    );
  };
  //#region =========== Properties of the dialog============
  const animatedDialogContentProps = {
    type: DialogType.normal,
    title: "Warning - Goods will be issued",
    subText: "After save the Goods will be issued. Do you want to continue?",
  };

  const animatedModalProps = {
    isDarkOverlay: true,
    isBlocking: true,
  };
  //#endregion
  return (
    <div style={{ width: 120 }}>
      <PrimaryButton
        text="Sumbit"
        iconProps={{ iconName: "Save" }}
        onClick={handleSubmit}
        allowDisabledFocus
        disabled={disabled || isSubmitting}
      />
      <AnimatedDialog
        hidden={!showAnimatedDialog}
        onDismiss={() => {
          setShowAnimatedDialog(false);
          setIsSubmitting(false);
        }}
        dialogContentProps={animatedDialogContentProps}
        modalProps={animatedModalProps}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={async () => {
              setIsConfirmed(true);
              await handleSubmit();
            }}
            text="Yes"
          />
          <DefaultButton
            onClick={() => {
              setShowAnimatedDialog(false);
              setIsSubmitting(false);
            }}
            text="No"
          />
        </DialogFooter>
      </AnimatedDialog>
    </div>
  );
}
