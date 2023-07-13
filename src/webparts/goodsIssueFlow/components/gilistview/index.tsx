import * as React from "react";
import { memo, useEffect, useContext, useState, useCallback } from "react";
import { Field, FieldArray, Form, Formik } from "formik";

import {
  ListView,
  IViewField,
  SelectionMode,
} from "@pnp/spfx-controls-react/lib/ListView";
import { useRequests } from "../../../../common/hooks/useRequests";
import styles from "./GIListView.module.scss";
import { IRequestListItem } from "../../../../common/model/requests";
import AppContext from "../../../../common/AppContext";
import { FieldUserRenderer } from "@pnp/spfx-controls-react";
import {
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  mergeStyleSets,
  Stack,
} from "office-ui-fabric-react";
import { REQUESTSCONST, RequestStatus } from "../../../../common/features/requests";
import {
  FormikDropdown,
  FormikDatePicker,
  FormikCheckbox,
  FormikTextField,
} from "../../../../common/components";
import ResetAction from "./resetAction";
import AllErrors from "./allErrors";
import { formValidationSchema } from "./formValidation";
import SubmitAction from "./submitAction";
import SimpleEmpty from "../../../../common/components/Empty";

export default memo(function index() {
  const ctx = useContext(AppContext);
  const [isFetchingRequest, , , requests, , , , , , , , , , ,] = useRequests();
  const [listviewItems, setListViewItems] =
    useState<IRequestListItem[]>(undefined);

  useEffect(() => {
    setListViewItems([...requests]);
  }, [requests]);

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
      const res = requests.filter((i) => i.ID === ID);
      if (res.length > 0) {
        return (
          res[0].Status === "GI / In Transit" || res[0].Status === "Completed"
        );
      }
      return false;
    },
    [requests]
  );

  //#region ==============Styles and Templates==============
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 150 },
  };
  const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 100 },
  };
  const dataPickerClass = mergeStyleSets({
    control: {
      maxWidth: "300px",
      minWidth: "165px",
    },
  });
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
          background: "rgb(0, 120, 212)",
        },
      },
    },
  };
  const stackTokens: IStackTokens = { childrenGap: 8 };
  const listviewFields: IViewField[] = [
    {
      name: "RequestNumber",
      displayName: "Request Number",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      sorting: false,
    },
    {
      name: "Requestor",
      displayName: "Requested By",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return rowitem.Requestor !== "" ? (
            <FieldUserRenderer
              users={JSON.parse(rowitem.Requestor)} //FieldUserRenderer users value {JSON.parse("[{\"id\":\"11\",\"title\":\"Qin Howard (Consultant)\",\"email\":\"howard.qin@consultant.udtrucks.com\",\"sip\":\"howard.qin@consultant.udtrucks.com\",\"picture\":\"https://udtrucks-my.sharepoint.com:443/User%20Photos/Profile%20Pictures/c1f6b293-e3c7-4c33-9b17-040ffdb5a3b7_MThumb.jpg?t=63800730891\",\"jobTitle\":\"Consultant_EX\",\"department\":\"BP15861\"}]")}
              context={ctx.context}
            />
          ) : (
            ""
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "RequesterId_x003a_Name",
      displayName: "Requestor",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: false,
    },
    {
      name: "TerminalId_x003a_Name",
      displayName: "Terminal",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: false,
    },
    {
      name: "PartID",
      displayName: "Part ID",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: false,
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
      name: "DateNeeded",
      displayName: "Date Needed",
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
      name: "HowMuchCanBeFullfilled",
      displayName: "How much can be full filled",
      minWidth: 175,
      maxWidth: 200,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              component={FormikTextField}
              name={`formlvItems[${getIndexByID(
                rowitem.ID
              )}].HowMuchCanBeFullfilled`}
              styles={narrowTextFieldStyles}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "Status",
      displayName: "Status",
      isResizable: true,
      sorting: false,
      minWidth: 150,
      maxWidth: 210,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              name={`formlvItems[${getIndexByID(rowitem.ID)}].Status`}
              component={FormikDropdown}
              styles={dropdownStyles}
              placeholder="Select a status"
              options={REQUESTSCONST.STATUS_OPTIONS}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "FullOrPartialFilled",
      displayName: "Full//Partial Filled",
      isResizable: true,
      sorting: false,
      minWidth: 150,
      maxWidth: 210,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              name={`formlvItems[${getIndexByID(
                rowitem.ID
              )}].FullOrPartialFilled`}
              component={FormikDropdown}
              styles={dropdownStyles}
              placeholder="Select a option"
              options={REQUESTSCONST.FULLORPARTIAL_OPTIONS}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "StatusUpdateBy",
      displayName: "Status Update By",
      minWidth: 150,
      maxWidth: 210,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return rowitem.StatusUpdateBy !== "" ? (
            <FieldUserRenderer
              users={JSON.parse(rowitem.StatusUpdateBy)}
              context={ctx.context}
            />
          ) : (
            ""
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "QtySent",
      displayName: "Qty Sent",
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              component={FormikTextField}
              name={`formlvItems[${getIndexByID(rowitem.ID)}].QtySent`}
              styles={narrowTextFieldStyles}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "DateByWhenItWillReach",
      displayName: "Date by when it will reach",
      minWidth: 165,
      maxWidth: 300,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              name={`formlvItems[${getIndexByID(
                rowitem.ID
              )}].DateByWhenItWillReach`}
              component={FormikDatePicker}
              className={dataPickerClass.control}
              placeholder="Select a date..."
              ariaLabel="Select a date"
              disabled={isFreezed(rowitem.ID)}
              minDate={new Date(Date.now())}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "ConfirmationFromSupplier",
      displayName: "Confirmation from supplier",
      minWidth: 165,
      maxWidth: 300,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Field
              name={`formlvItems[${getIndexByID(
                rowitem.ID
              )}].ConfirmationFromSupplier`}
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
        (rowitem: IRequestListItem) => {
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
        (rowitem: IRequestListItem) => {
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
      render: (rowitem: IRequestListItem) => {
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
    },
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
                    {props.values.formlvItems &&
                    props.values.formlvItems.length > 0 ? (
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
                    ) :null}
                    {props.errors && <AllErrors errors={props.errors} />}
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      ) :  (
        (isFetchingRequest===RequestStatus.Idle)?<SimpleEmpty/>:null
      )}
    </>
  );
});
