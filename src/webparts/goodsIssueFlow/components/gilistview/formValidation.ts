import * as Yup from "yup";
export const formValidationSchema = Yup.object().shape({
  formlvItems: Yup.array().of(
    Yup.object().shape({
      HowMuchCanBeFullfilled: Yup.number()
        .transform((_value, originalValue) =>
          Number(originalValue.replace(/,/g, ""))
        )
        .typeError(
          "How much can be full filled must be a number, but current value was not a number"
        )
        .positive("How much can be full filled must be a positive number"),
      QtySent: Yup.number()
        .transform((_value, originalValue) =>
          Number(originalValue.replace(/,/g, ""))
        )
        .typeError(
          "Qty sent must be a number, but current value was not a number"
        )
        .positive("Qty sent must be a positive number")
        .oneOf(
          [Yup.ref("HowMuchCanBeFullfilled"), null],
          "How much can be full filled should always be equal to Qty sent"
        ),
    })
  ),
});
