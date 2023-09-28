import { ITextFieldProps, TextField } from "@fluentui/react";
import { FieldProps, useFormikContext } from "formik";
import * as React from "react";
import { getErrorMessage, Omit } from "../../../../common/components/utils";
import { IRequestListItem } from "../../../../common/model";

interface IFormValues {
  formlvItems: IRequestListItem[];
}
function GetIdxFromName(name: string): number {
  return Number.parseInt(
    name.substring(name.indexOf("[") + 1, name.indexOf("]"))
  );
}
export function mapFieldToTextField<
  V extends string = string,
  FormValues = IFormValues
>({
  form,
  field,
  meta,
}: FieldProps<V, FormValues>): Pick<
  ITextFieldProps,
  "value" | "name" | "onChange" | "onBlur" | "errorMessage" | "form"
> {
  return {
    ...field,
    errorMessage: getErrorMessage({ form, field, meta }),
  };
}

export type FormikTextFieldProps<
  V extends string,
  FormValues = IFormValues
> = Omit<ITextFieldProps, "value" | "name" | "onChange" | "onBlur" | "form"> &
  FieldProps<V, FormValues>;

export function QtySentField<V extends string, FormValues = IFormValues>({
  field,
  form,
  meta,
  ...props
}: FormikTextFieldProps<V, FormValues>): JSX.Element {
  const { errorMessage, ...fieldProps } = mapFieldToTextField({
    field,
    form,
    meta,
  });
  const { values, setFieldValue } = useFormikContext();
  const idx = GetIdxFromName(field.name);
  const rowValues = (
    values as {
      formlvItems: IRequestListItem[];
    }
  ).formlvItems[idx];
  return (
    <TextField
      errorMessage={errorMessage ? "Invalid" : ""}
      {...props}
      {...fieldProps}
      onKeyUp={async (e) => {
        // Request to keyin Coloum QTY Sent and data will copy to column how much cab be full filled
        await setFieldValue(
          `formlvItems[${idx}].HowMuchCanBeFullfilled`,
          rowValues.QtySent,
          false
        );
      }}
    />
  );
}
