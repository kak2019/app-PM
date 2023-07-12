import { useFormikContext } from "formik";
import { IDistributionListItem } from "../../../../common/model";
import { DefaultButton } from "office-ui-fabric-react";
import * as React from "react";

interface IResetAction {
    disabled: boolean;
    idx: number;
}
interface IFormValues {
    formlvItems: IDistributionListItem[]
}
export default function ResetAction({ disabled, idx }: IResetAction): JSX.Element {
    const { initialValues, setFieldValue } = useFormikContext();
    return (
        <DefaultButton
            text="Reset"
            iconProps={{ iconName: 'EraseTool' }}
            onClick={async () => {
                const rowValues = (initialValues as IFormValues).formlvItems[idx];
                await setFieldValue(`formlvItems[${idx}].ConfirmationFromReceiver`, rowValues.ConfirmationFromReceiver, false);
                await setFieldValue(`formlvItems[${idx}].Field1`, rowValues.Field1, false);
                await setFieldValue(`formlvItems[${idx}].Field2`, rowValues.Field2, false);
            }}
            allowDisabledFocus
            disabled={disabled}
        />
    )
}