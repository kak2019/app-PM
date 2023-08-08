import { useFormikContext } from "formik";
import { DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import { IRequestListItem } from "../../../../common/model";

interface IResetAction {
  disabled: boolean;
  idx: number;
}
interface IFormValues {
  formlvItems: IRequestListItem[]
}
export default function ResetAction({ disabled, idx }: IResetAction): JSX.Element {
  const { initialValues, setFieldValue } = useFormikContext();
  return (
    <DefaultButton
      text="Reset"
      iconProps={{ iconName: 'EraseTool' }}
      onClick={async () => {
        const rowValues = (initialValues as IFormValues).formlvItems[idx];
        await setFieldValue(`formlvItems[${idx}].HowMuchCanBeFullfilled`, rowValues.HowMuchCanBeFullfilled, false);
        await setFieldValue(`formlvItems[${idx}].Status`, rowValues.Status, false);
        await setFieldValue(`formlvItems[${idx}].FullOrPartialFilled`, rowValues.FullOrPartialFilled, false);
        await setFieldValue(`formlvItems[${idx}].QtySent`, rowValues.QtySent, false);
        await setFieldValue(`formlvItems[${idx}].DateByWhenItWillReach`, rowValues.DateByWhenItWillReach, false);
        await setFieldValue(`formlvItems[${idx}].ConfirmationFromSupplier`, rowValues.ConfirmationFromSupplier, false);
        await setFieldValue(`formlvItems[${idx}].Field1`, rowValues.Field1, false);
        await setFieldValue(`formlvItems[${idx}].Field2`, rowValues.Field2, false);
        await setFieldValue(`formlvItems[${idx}].Remarks`, rowValues.Remarks, false);
      }}
      allowDisabledFocus
      disabled={disabled}
    />
  );
}
