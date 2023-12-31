import { FormikErrors } from "formik";
import * as React from "react";
import { IRequestListItem } from "../../../../common/model";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";

interface IAllErrors {
  errors: FormikErrors<{
    formlvItems: IRequestListItem[];
  }>;
}
type FormikErrorValues = FormikErrors<string> | FormikErrors<Date>;
export default function AllErrors({ errors }: IAllErrors): JSX.Element {
  const res = new Set<FormikErrorValues>();
  if (errors.formlvItems) {
    if (typeof errors.formlvItems === "string") {
      res.add(errors.formlvItems);
    } else {
      for (const value of errors.formlvItems) {
        if (typeof value === "string") {
          res.add(value);
        } else {
          if (value?.HowMuchCanBeFullfilled)
            res.add(value.HowMuchCanBeFullfilled);
          if (value?.QtySent) res.add(value.QtySent);
          if (value?.DateByWhenItWillReach)
            res.add(value.DateByWhenItWillReach);
        }
      }
    }
  }
  const res2: FormikErrorValues[] = [];
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
