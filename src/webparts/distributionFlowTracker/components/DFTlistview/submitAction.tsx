import { useFormikContext } from "formik";
import { IDistributionFlowTrackerError, IDistributionListItem } from "../../../../common/model";
import { useEntities } from "../../../../common/hooks";
import { useDistributions } from "../../../../common/hooks/useDistributions";
import { useBoolean } from "@fluentui/react-hooks";
import { IPrincipal } from "@pnp/spfx-controls-react";
import * as React from "react";
import { PrimaryButton } from "office-ui-fabric-react";
import ConfirmationBox from "../../../../common/components/Box/ConfirmationBox";
import SuccessConfirmationBox from "../../../../common/components/Box/SuccessConfirmationBox";
import { memo } from "react";

interface ISubmitAction {
    disabled: boolean;
    idx: number;
}
interface IFormValues {
    formlvItems: IDistributionListItem[];
}
interface IFormErrors {
    formlvItems?: IDistributionFlowTrackerError[];
}

export default memo(function SubmitAction({
    disabled,
    idx
}: ISubmitAction): JSX.Element {
    const { values, errors } = useFormikContext();
    const [, , , , myEntity, , ,] = useEntities();
    const [
        ,
        ,
        distribution,
        ,
        ,
        distributionSender,
        ,
        fetchDistributionsBySender,
        ,
        ,
        ,
        changeDistributionId,
        ,
        editDistribution
    ] = useDistributions();

    const [isSubmitting, { toggle: toggleIsSubmitting }] = useBoolean(false);
    const [hideConfirmDialog, { toggle: toggleHideConfirmDialog }] = useBoolean(true);
    const [hideResultDialog, { toggle: toggleHideResultDialog }] = useBoolean(true);

    const saveData = async (): Promise<void> => {
        toggleIsSubmitting();
        const rowValues = { ...(values as IFormValues).formlvItems[idx] };
        const distribution = {
            ID: rowValues.ID,
            Status: rowValues.Status,
            ConfirmationFromReceiver: rowValues.ConfirmationFromReceiver,
            Field1: rowValues.Field1,
            Field2: rowValues.Field2,
            Remarks: rowValues.Remarks,
            StatusUpdatedById: (
                JSON.parse(myEntity.Users)[0] as IPrincipal
            ).id.toString(),
        };
        await editDistribution({ distribution });
        fetchDistributionsBySender(distributionSender);
        toggleHideResultDialog();
        toggleIsSubmitting();
        fetchDistributionsBySender(distributionSender);
    };
    const handleSubmit = (): void => {
        if ((errors as IFormErrors).formlvItems) {
            const r = (errors as IFormErrors).formlvItems[idx];
            if (r !== undefined) {
                return;
            }
        }

        const rowValues = { ...(values as IFormValues).formlvItems[idx] };
        changeDistributionId(rowValues.ID);
        toggleHideConfirmDialog();
        return;
        // if (rowValues.ConfirmationFromReceiver || !rowValues.ConfirmationFromReceiver) {
        //     toggleHideConfirmDialog();
        //     return;
        // }
        // saveData().catch(console.log);
    };
    return (
        <div style={{ width: 120 }}>
            <PrimaryButton
                text="save"
                iconProps={{ iconName: "Save" }}
                onClick={handleSubmit}
                allowDisabledFocus
                disabled={disabled || isSubmitting}
            />
            <ConfirmationBox
                isOpen={hideConfirmDialog}
                onDismiss={toggleHideConfirmDialog}
                confirmationDetails={{
                    title: "Data will be saved",
                    subTitle:
                        "Do you want to continue?"
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
                message={`Data you inputed in distribution ${distribution.DistributionNumber} saved successfully`}
            />
        </div>
    );
});