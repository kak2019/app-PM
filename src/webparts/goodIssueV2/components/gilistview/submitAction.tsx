import * as React from "react";
import { memo } from "react";
import { useFormikContext } from "formik";
import { PrimaryButton } from "office-ui-fabric-react";

import { IRequestGIError, IRequestListItem } from "../../../../common/model";
import { useBoolean } from "@fluentui/react-hooks";
import { useRequestsBundle, useEntities } from "../../../../common/hooks";
import { IPrincipal } from "@pnp/spfx-controls-react";
import ConfirmationBox from "../../../../common/components/Box/ConfirmationBox";
import SuccessConfirmationBox from "../../../../common/components/Box/SuccessConfirmationBox";

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

export default memo(function SubmitAction({
  disabled,
  idx,
}: IResetAction): JSX.Element {
  const { values, errors } = useFormikContext();
  const [, , , , myEntity, , ,] = useEntities();
  const [
    ,
    ,
    request,
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
  ] = useRequestsBundle();

  const [isSubmitting, { toggle: toggleIsSubmitting }] = useBoolean(false);
  const [hideConfirmDialog, { toggle: toggleHideConfirmDialog }] =
    useBoolean(true);
  const [hideResultDialog, { toggle: toggleHideResultDialog }] =
    useBoolean(true);

  const saveData = async (): Promise<void> => {
    toggleIsSubmitting();
    const rowValues = { ...(values as IFormValues).formlvItems[idx] };
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
      Remarks: rowValues.Remarks,
      StatusUpdateById: (
        JSON.parse(myEntity.Users)[0] as IPrincipal
      ).id.toString(),
    };
    await editRequest({ request });
    fetchRequestsByTermialId(requestTermialId);

    toggleHideResultDialog();
    toggleIsSubmitting();
  };
  const handleSubmit = (): void => {
    if ((errors as IFormErrors).formlvItems) {
      const r = (errors as IFormErrors).formlvItems[idx];
      if (r !== undefined) {
        return;
      }
    }
    const rowValues = { ...(values as IFormValues).formlvItems[idx] };
    changeRequestId(rowValues.ID);
    if (rowValues.Status === "GI / In Transit") {
      toggleHideConfirmDialog();
      return;
    }
    saveData().catch(console.log);
  };

  return (
    <div style={{ width: 120 }}>
      <PrimaryButton
        text="Sumbit"
        iconProps={{ iconName: "Save" }}
        onClick={handleSubmit}
        allowDisabledFocus
        disabled={disabled || isSubmitting}
      />
      <ConfirmationBox
        isOpen={hideConfirmDialog}
        onDismiss={toggleHideConfirmDialog}
        confirmationDetails={{
          title: "Warning - Goods will be issued",
          subTitle:
            "After save the Goods will be issued. Do you want to continue?",
        }}
        confirmationYesCallback={() => {
          saveData().catch(console.log);
          toggleHideConfirmDialog();
        }}
        confirmationNoCallback={toggleHideConfirmDialog}
      />
      <SuccessConfirmationBox
        isOpen={hideResultDialog}
        onDismiss={toggleHideResultDialog}
        message={`Data you inputed in request ${request.RequestNumber} saved successfully`}
      />
    </div>
  );
})
