import { DatePicker, IDatePickerProps, DayOfWeek } from 'office-ui-fabric-react';
import { FieldProps, ErrorMessage } from 'formik';
import * as React from 'react';
import { createFakeEvent, invokeAll, Omit } from '../utils';
import { formatDate } from './DatePickerHelper';


interface Custom {
  required: boolean;
}

export const mapFieldToDatePicker = ({ form, field }: FieldProps): Pick<IDatePickerProps, 'value' | 'onSelectDate' | 'onAfterMenuDismiss'> => {
  return {
    value: field.value ? new Date(field.value.toString()) : null,
    onAfterMenuDismiss: () => !field.value ? field.onBlur(createFakeEvent(field)) : {},
    onSelectDate: date => form.setFieldValue(field.name, date),
  };
};

export type FormikDatePickerProps = Omit<IDatePickerProps, 'value' | 'onSelectDate' | 'onBlur' | 'onChange'>
  & FieldProps & Custom;

export const FormikDatePicker = ({ field, form, ...props }: FormikDatePickerProps):JSX.Element => {
  const { onAfterMenuDismiss, ...fieldProps } = mapFieldToDatePicker({ field, form } as FieldProps);

  return (
    <>
      <DatePicker
        {...props}
        isRequired={props.isRequired || props.required}
        formatDate={formatDate || props.formatDate}
        firstDayOfWeek={DayOfWeek.Monday}
        onAfterMenuDismiss={invokeAll(onAfterMenuDismiss, props.onAfterMenuDismiss)}
        {...fieldProps}
      />
      <ErrorMessage component="p"  name={field.name} />
    </>
  );
};