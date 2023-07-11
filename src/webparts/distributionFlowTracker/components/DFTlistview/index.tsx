import { memo, useCallback, useContext, useEffect, useState } from "react"
import AppContext from "../../../../common/AppContext"
import { useDistributions } from "../../../../common/hooks/useDistributions";
import { IDistributionListItem } from "../../../../common/model";
import { IDropdownStyles, IStackTokens, ITextFieldStyles, SelectionMode, Stack } from "office-ui-fabric-react";
import { IViewField, ListView } from "@pnp/spfx-controls-react/lib/ListView";
import { Field, FieldArray, Form, Formik } from "formik";
import * as React from "react";
import { FormikCheckbox, FormikDropdown, FormikTextField } from "../../../../common/components";
import { DISTRIBUTIONCONST } from "../../../../common/features/distributions";
import { FieldUserRenderer } from "@pnp/spfx-controls-react";
import SubmitAction from "./submitAction";
import ResetAction from "./resetAction";
import { formValidationSchema } from "./formValidation";
import AllErrors from "./allErrors";
import styles from "./DFTListView.module.scss"



export default memo(function index() {
    const ctx = useContext(AppContext);
    const [, , , distributions, , , , , , , , , , ,] = useDistributions();
    const [listviewItems, setListViewItems] = useState<IDistributionListItem[]>(undefined);
    useEffect(() => {
        setListViewItems([...distributions]);
    }, [distributions]);

    const getIndexByID = useCallback(
        (ID: string): number => {
            const res = listviewItems.filter((i) => i.ID === ID);
            if (res.length > 0) {
                return listviewItems.indexOf(res[0]);
            }
            return -1;
        },
        [listviewItems]
    );

    const isFreezed = useCallback(
        (ID: string): boolean => {
            const res = distributions.filter((i) => i.ID === ID);
            if (res.length > 0) {
                return (
                    !res[0].ConfirmationFromReceiver
                );
            }
            return false;
        },
        [distributions]
    )

    //#region ==============Styles and Templates==============
    const textFieldStyles: Partial<ITextFieldStyles> = {
        fieldGroup: { width: 150 }
    };
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 120 },
        dropdownItemSelected: {
            selectors: {
                "&:before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: "rgb(0, 120, 212)"
                }
            }
        }
    };
    const stackTokens: IStackTokens = { childrenGap: 8 };
    const listviewFields: IViewField[] = [
        {
            name: "DistributionNumber",
            displayName: "Distribution Number",
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            sorting: false
        },
        {
            name: "Sender_x003a__x0020_Name",
            displayName: "Sender",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            sorting: false
        },
        {
            name: "Receiver_x003a__x0020_Name",
            displayName: "Receiver",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            sorting: false
        },
        {
            name: "PartNumber",
            displayName: "Part Number",
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            sorting: false
        },
        {
            name: "PartDescription",
            displayName: "Part Description",
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            sorting: false,
        },
        {
            name: "Quantity",
            displayName: "Quantity",
            minWidth: 65,
            maxWidth: 80,
            isResizable: true,
            sorting: false,
        },
        {
            name: "ReceivedByDate",
            displayName: "Received By Date",
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            sorting: false,
        },
        {
            name: "DeliveryLocationAndCountry",
            displayName: "Delivery Location and Country",
            minWidth: 200,
            maxWidth: 250,
            isResizable: true,
            sorting: false,
        },
        {
            name: "Status",
            displayName: "Status",
            isResizable: true,
            sorting: false,
            minWidth: 150,
            maxWidth: 210,
            render: useCallback(
                (rowitem: IDistributionListItem) => {
                    return (
                        <Field
                            name={`formlvItems[${getIndexByID(rowitem.ID)}].Status`}
                            component={FormikDropdown}
                            styles={dropdownStyles}
                            placeholder="Select a status"
                            options={DISTRIBUTIONCONST.STATUS_OPTIONS}
                            disabled={true}
                        />
                    );
                },
                [listviewItems]
            ),
        },
        {
            name: "StatusUpdatedBy",
            displayName: "Status Updated By",
            minWidth: 150,
            maxWidth: 210,
            isResizable: true,
            sorting: false,
            render: useCallback(
                (rowitem: IDistributionListItem) => {
                    return (
                        (rowitem.StatusUpdatedBy !== "" ?
                            <FieldUserRenderer
                                users={JSON.parse(rowitem.StatusUpdatedBy)}
                                context={ctx.context}
                            /> : ""
                        )
                    );
                },
                [listviewItems]
            ),
        },
        {
            name: "ConfirmationFromReceiver",
            displayName: "Confirmation from Receiver",
            minWidth: 165,
            maxWidth: 300,
            isResizable: true,
            sorting: false,
            render: useCallback(
                (rowitem: IDistributionListItem) => {
                    return (
                        <Field
                            name={`formlvItems[${getIndexByID(
                                rowitem.ID
                            )}].ConfirmationFromReceiver`}
                            component={FormikCheckbox}
                            disabled={isFreezed(rowitem.ID)}
                        />
                    );
                },
                [listviewItems]
            ),
        },
        {
            name: "Field1",
            displayName: "Field1",
            minWidth: 150,
            maxWidth: 180,
            isResizable: false,
            sorting: false,
            render: useCallback(
                (rowitem: IDistributionListItem) => {
                    return (
                        <Field
                            component={FormikTextField}
                            name={`formlvItems[${getIndexByID(rowitem.ID)}].Field1`}
                            styles={textFieldStyles}
                            disabled={isFreezed(rowitem.ID)}
                        />
                    );
                },
                [listviewItems]
            ),
        },
        {
            name: "Field2",
            displayName: "Field2",
            minWidth: 150,
            maxWidth: 180,
            isResizable: false,
            sorting: false,
            render: useCallback(
                (rowitem: IDistributionListItem) => {
                    return (
                        <Field
                            component={FormikTextField}
                            name={`formlvItems[${getIndexByID(rowitem.ID)}].Field2`}
                            styles={textFieldStyles}
                            disabled={isFreezed(rowitem.ID)}
                        />
                    );
                },
                [listviewItems]
            ),
        },
        {
            name: "Actions",
            minWidth: 250,
            isResizable: false,
            render: (rowitem: IDistributionListItem) => {
                return (
                    <Stack horizontal tokens={stackTokens}>
                        <SubmitAction
                            disabled={isFreezed(rowitem.ID)}
                            idx={getIndexByID(rowitem.ID)}
                        />
                        <ResetAction
                            disabled={isFreezed(rowitem.ID)}
                            idx={getIndexByID(rowitem.ID)}
                        />
                    </Stack>
                );
            },
        }
    ];
    //#endregion

    return (
        <>
            {listviewItems?.length > 0 ? (
                <Formik
                    initialValues={{ formlvItems: listviewItems }}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                            console.log(JSON.stringify(values.formlvItems, null, 2));
                            actions.setSubmitting(false);
                        }, 1000);
                    }}
                    validationSchema={formValidationSchema}
                >
                    {(props) => (
                        <Form>
                            <FieldArray
                                name="formlvItems"
                                render={(arrayHelpers) => (
                                    <div>
                                        {props.values.formlvItems && props.values.formlvItems.length > 0 ? (
                                            <ListView
                                                items={listviewItems}
                                                viewFields={listviewFields}
                                                selectionMode={SelectionMode.none}
                                                showFilter={true}
                                                filterPlaceHolder="Search..."
                                                stickyHeader={true}
                                                className={styles.listWrapper}
                                                listClassName={styles.list}
                                            />
                                        ) : null}
                                        {props.errors && <AllErrors errors={props.errors} />}
                                    </div>
                                )}
                            />
                        </Form>
                    )}
                </Formik>
            ) : null}
        </>
    )
});
