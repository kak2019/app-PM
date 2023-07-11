import * as Yup from "yup";

export const formValidationSchema = Yup.object().shape({
    formlvItems: Yup.array().of(
        Yup.object().shape({
            ConfirmationFromReceiver: Yup.boolean().required()
        })
    )
});