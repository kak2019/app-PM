import * as React from "react";
import { memo, useEffect, useContext, useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
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
  ITextFieldStyles,
  mergeStyleSets,
  PrimaryButton,
} from "office-ui-fabric-react";
import { REQUESTSCONST } from "../../../../common/features/requests";
import { FormikDropdown,FormikDatePicker,FormikCheckbox,FormikTextField } from "../../../../common/components";

export default memo(function index() {
  const ctx = useContext(AppContext);

  const [, , , requests, , , , , , , , , , ,] = useRequests();
  const [listviewItems, setListViewItems] =
    useState<IRequestListItem[]>(undefined);

  useEffect(() => {
    setListViewItems([...requests]);
  }, [requests]);

  //#region ==============Styles and Templates==============
  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 150 } };
  const narrowTextFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 100 } };
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
  const listviewFields: IViewField[] = [
    {
      name: "RequestNumber",
      displayName: "Request Number",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      sorting: true,
    },
    {
      name: "Requestor",
      displayName: "Requested By",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      sorting: true,
      render: (rowitem: IRequestListItem) => {
        return (
          (
            <FieldUserRenderer
              users={JSON.parse(rowitem.Requestor)}
              context={ctx.context}
            />
          ) || ""
        );
        //return <FieldUserRenderer users={JSON.parse("[{\"id\":\"11\",\"title\":\"Qin Howard (Consultant)\",\"email\":\"howard.qin@consultant.udtrucks.com\",\"sip\":\"howard.qin@consultant.udtrucks.com\",\"picture\":\"https://udtrucks-my.sharepoint.com:443/User%20Photos/Profile%20Pictures/c1f6b293-e3c7-4c33-9b17-040ffdb5a3b7_MThumb.jpg?t=63800730891\",\"jobTitle\":\"Consultant_EX\",\"department\":\"BP15861\"}]")} context={ctx.context}/>
        // if (rowitem.Requestor !== "") {
        //   const u: IPrincipal[] = JSON.parse(rowitem.Requestor) as IPrincipal[];
        //   return u[0].title;
        // } else {
        //   return "";
        // }
      },
    },
    {
      name: "RequesterId_x003a_Name",
      displayName: "Requestor",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: true,
    },
    {
      name: "TerminalId_x003a_Name",
      displayName: "Terminal",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: true,
    },
    {
      name: "PartID",
      displayName: "Part ID",
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      sorting: true,
    },
    {
      name: "PartDescription",
      displayName: "Part Description",
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      sorting: true,
    },
    {
      name: "Quantity",
      displayName: "Quantity",
      minWidth: 65,
      maxWidth: 80,
      isResizable: true,
      sorting: true,
    },
    {
      name: "DateNeeded",
      displayName: "Date Needed",
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      sorting: true,
    },
    {
      name: "DeliveryLocationAndCountry",
      displayName: "Delivery Location and Country",
      minWidth: 200,
      maxWidth: 250,
      isResizable: true,
      sorting: true,
    },
    {
      name: "HowMuchCanBeFullfilled",
      displayName: "How much can be full filled",
      minWidth: 175,
      maxWidth: 200,
      isResizable: false,
      sorting: true,
      render: (rowitem: IRequestListItem, index: number) => {
        return (
          <Field
            component={FormikTextField}
            name={`formlvItems[${index}].HowMuchCanBeFullfilled`} styles={narrowTextFieldStyles}
          />
        );
      },
    },
    {
      name: "Status",
      displayName: "Status",
      isResizable: true,
      sorting: true,
      minWidth: 150,
      maxWidth: 210,
      render: (rowitem: IRequestListItem, index: number) => {
        return (
          <Field
            name={`formlvItems[${index}].Status`}
            component={FormikDropdown}
            styles={dropdownStyles}
            placeholder="Select a status"
            options={REQUESTSCONST.STATUS_OPTIONS}
          />
        );
      },
    },
    {
      name: "FullOrPartialFilled",
      displayName: "Full//Partial Filled",
      isResizable: true,
      sorting: true,
      minWidth: 150,
      maxWidth: 210,
      render: (rowitem: IRequestListItem, index: number) => {
        return (
          <Field
            name={`formlvItems[${index}].FullOrPartialFilled`}
            component={FormikDropdown}
            styles={dropdownStyles}
            placeholder="Select a option"
            options={REQUESTSCONST.FULLORPARTIAL_OPTIONS}
          />
        );
      },
    },
    {
      name: "StatusUpdateBy",
      displayName: "Status Update By",
      minWidth: 150,
      maxWidth: 210,
      isResizable: true,
      sorting: true,
      render: (rowitem: IRequestListItem) => {
        return (
          (
            <FieldUserRenderer
              users={JSON.parse(rowitem.StatusUpdateBy)}
              context={ctx.context}
            />
          ) || ""
        );
      },
    },
    {
      name: "QtySent",
      displayName: "Qty Sent",
      minWidth: 100,
      maxWidth: 120,
      isResizable: false,
      sorting: true,
      render: (rowitem: IRequestListItem, index: number) => {
        return <Field component={FormikTextField} name={`formlvItems[${index}].QtySent`} styles={narrowTextFieldStyles} />;
      },
    },
    {
      name: "DateByWhenItWillReach",
      displayName: "Date by when it will reach",
      minWidth: 165,
      maxWidth: 300,
      isResizable: true,
      sorting: true,
      render: (rowitem: IRequestListItem, index: number) => {
        return (
          <Field
            name={`formlvItems[${index}].DateByWhenItWillReach`}
            component={FormikDatePicker}
            className={dataPickerClass.control}
            placeholder="Select a date..."
            ariaLabel="Select a date"
          />
        );
      },
    },
    {
      name: "ConfirmationFromSupplier",
      displayName: "Confirmation from supplier",
      minWidth: 165,
      maxWidth: 300,
      isResizable: true,
      sorting: true,
      render: (rowitem: IRequestListItem,index:number) => {
        return (
          <Field name={`formlvItems[${index}].ConfirmationFromSupplier`} component={FormikCheckbox}/>
        );
      },
    },
    {
      name: "Field1",
      displayName: "Field1",
      minWidth: 150,
      maxWidth: 180,
      isResizable: false,
      sorting: true,
      render: (rowitem: IRequestListItem,index:number) => {
        return <Field component={FormikTextField} name={`formlvItems[${index}].Field1`}  styles={textFieldStyles}/>;
      },
    },
    {
      name: "Field2",
      displayName: "Field2",
      minWidth: 150,
      maxWidth: 180,
      isResizable: false,
      sorting: true,
      render: (rowitem: IRequestListItem,index:number) => {
        return <Field component={FormikTextField} name={`formlvItems[${index}].Field2`}  styles={textFieldStyles}/>;
      },
    },
  ];
  //#endregion
  const formValidationSchema = Yup.object().shape({
    formlvItems: Yup.array()
      .of(
        Yup.object().shape({
          HowMuchCanBeFullfilled: Yup.number().min(1, 'should be greater than 0').integer(),
          QtySent: Yup.number().min(1, 'should be greater than 0').integer(),
        })
      ),
  });

  return (
    <div style={{ flex: "0 0 auto" }}>
      {listviewItems?.length > 0 ? (
        <Formik
          initialValues={{ formlvItems: listviewItems }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              console.log(JSON.stringify(values.formlvItems[0], null, 2));
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
                        items={props.values.formlvItems}
                        viewFields={listviewFields}
                        selectionMode={SelectionMode.none}
                        showFilter={true}
                        filterPlaceHolder="Search..."
                        stickyHeader={true}
                        className={styles.listWrapper}
                        listClassName={styles.list}
                      />
                    ) : null}

                    <div>
                      <PrimaryButton type="submit">Submit</PrimaryButton>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      ) : null}
    </div>
  );
});
