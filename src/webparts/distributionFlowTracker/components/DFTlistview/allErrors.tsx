import { FormikErrors } from "formik";
import * as React from "react";
import { IDistributionListItem } from "../../../../common/model";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";

interface IAllErrors {
    errors: FormikErrors<{
        formlvItems: IDistributionListItem[]
    }>;
}
export default function AllErrors({ errors }: IAllErrors): JSX.Element {
    const res = new Set<string>();
    if (errors.formlvItems) {
        if (typeof errors.formlvItems === "string") {
            res.add(errors.formlvItems);
        } else {
            for (const value of errors.formlvItems) {
                if (typeof value === "string") {
                    res.add(value);
                }
            }
        }
    }
    const res2: string[] = [];
    res.forEach((v) => res2.push(v));
    return res2.length > 0 ? (
    <>
        {res2.map((err, idx) => (
            <MessageBar messageBarType={MessageBarType.error} key={idx}>
                {err}
            </MessageBar>
        ))}
    </>
    ) : null;
}