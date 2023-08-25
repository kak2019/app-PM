import { memo, useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../../../common/AppContext";
import { useDistributions } from "../../../../common/hooks/useDistributions";
import { IDistributionListItem } from "../../../../common/model";
import {
  CommandBar,
  registerIcons,
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  SelectionMode,
  Stack,
} from "office-ui-fabric-react";
import { IViewField, ListView } from "@pnp/spfx-controls-react/lib/ListView";
import { Field, FieldArray, Form, Formik } from "formik";
import * as React from "react";
import {
  FormikCheckbox,
  FormikDropdown,
  FormikTextField,
} from "../../../../common/components";
import {
  DISTRIBUTIONCONST,
  DistributionStatus,
} from "../../../../common/features/distributions";
import { FieldUserRenderer } from "@pnp/spfx-controls-react";
import SubmitAction from "./submitAction";
//import ResetAction from "./resetAction";
import AllErrors from "./allErrors";
import styles from "./DFTListView.module.scss";
import SimpleEmpty from "../../../../common/components/Empty";
//import { formValidationSchema } from "./formValidation";
import { toCSV } from "../../../../common/components/toCSV";
// import CancelAction from "./cancelAction";

export default memo(function index() {
  const ctx = useContext(AppContext);
  const [isFetchingDistribution, , , distributions, , , , , , , , , , ,] =
    useDistributions();
  const [listviewItems, setListViewItems] =
    useState<IDistributionListItem[]>(undefined);
  useEffect(() => {
    setListViewItems([...distributions]);
  }, [distributions]);
  const reminder = "You haven't create any distribution flows";

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
        if (res[0].Status === "Cancelled") {
          return true;
        }
        return false;
      }
      return false;
    },
    [distributions]
  );

  // const isFreezedCancel = useCallback(
  //   (ID: string): boolean => {
  //     const res = distributions.filter((i) => i.ID === ID);
  //     if (res.length > 0) {
  //       if (res[0].Status === "Cancelled" || res[0].Status === "Completed") {
  //         return true;
  //       }
  //       return false;
  //     }
  //     return false;
  //   },
  //   [distributions]
  // );

  // const statusOptions = useCallback(
  //   (ID: string) => {
  //     const res = distributions.filter((i) => i.ID === ID);
  //     if (res.length > 0) {
  //       if (res[0].Status === "Completed") {
  //         return DISTRIBUTIONCONST.STATUS
  //       }
  //       return DISTRIBUTIONCONST.STATUS_OPTIONS
  //     }
  //     return DISTRIBUTIONCONST.STATUS_OPTIONS;
  //   },
  //   [distributions]
  // )
  //#region ==============Styles and Templates==============
  registerIcons({
    icons: {
      "excel-svg": (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            d="M10 0H4a1.003 1.003 0 0 0-1 1v3l7.001 4L13 9.968 16 8V4z"
            fill="#21a366"
          />
          <path fill="#107c41" d="M16 8H3v4l7 1.4 6-1.4V8z" />
          <path
            d="M3 12v3a1.003 1.003 0 0 0 1 1h11a1 1 0 0 0 1-1v-3z"
            fill="#185c37"
          />
          <path d="M10 4H3v10h6a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1z" opacity=".5" />
          <rect y="3" width="10" height="10" rx="1" fill="#107c41" />
          <path
            d="M2.292 11l1.942-3.008L2.455 5h1.431l.971 1.912q.134.272.184.406h.013q.096-.217.2-.423L6.293 5h1.314L5.782 7.975 7.652 11H6.255L5.133 8.9A1.753 1.753 0 0 1 5 8.62h-.016a1.324 1.324 0 0 1-.13.271L3.698 11z"
            fill="#fff"
          />
          <path d="M16 1v3h-6V0h5a1.003 1.003 0 0 1 1 1z" fill="#33c481" />
        </svg>
      ),
    },
  });
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 150 },
  };
  // const dataPickerClass = mergeStyleSets({
  //     control: {
  //         maxWidth: "300px",
  //         minWidth: "165px",
  //     },
  // });
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
      name: "DistributionNumber",
      displayName: "Distribution Number",
      minWidth: 150,
      maxWidth: 150,
      isResizable: true,
      sorting: false,
    },
    {
      name: "Sender_x003a__x0020_Name",
      displayName: "Sender",
      minWidth: 140,
      maxWidth: 140,
      isResizable: true,
      sorting: false,
    },
    {
      name: "Receiver_x003a__x0020_Name",
      displayName: "Receiver",
      minWidth: 140,
      maxWidth: 140,
      isResizable: true,
      sorting: false,
    },
    {
      name: "PartNumber",
      displayName: "Part Number",
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      sorting: false,
    },
    {
      name: "PartDescription",
      displayName: "Part Description",
      minWidth: 175,
      maxWidth: 175,
      isResizable: true,
      sorting: false,
    },
    {
      name: "Quantity",
      displayName: "Quantity",
      minWidth: 65,
      maxWidth: 65,
      isResizable: true,
      sorting: false,
    },
    {
      name: "ReceivedByDate",
      displayName: "Received By Date",
      minWidth: 120,
      maxWidth: 1200,
      isResizable: true,
      sorting: false,
    },
    {
      name: "DeliveryLocationandCountry",
      displayName: "Delivery Location and Country",
      minWidth: 220,
      maxWidth: 220,
      isResizable: true,
      sorting: false,
    },
    {
      name: "Status",
      displayName: "Status",
      isResizable: true,
      sorting: false,
      minWidth: 130,
      maxWidth: 130,
      render: useCallback(
        (rowitem: IDistributionListItem) => {
          if (isFreezed(rowitem.ID)) {
            return "Cancelled";
          } else {
            return (
              <Field
                name={`formlvItems[${getIndexByID(rowitem.ID)}].Status`}
                component={FormikDropdown}
                styles={dropdownStyles}
                placeholder="Select a status"
                options={DISTRIBUTIONCONST.STATUS}
                disabled={true}
              />
            );
          }
        },
        [listviewItems]
      ),
    },
    {
      name: "StatusUpdatedBy",
      displayName: "Status Updated By",
      minWidth: 120,
      maxWidth: 120,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IDistributionListItem) => {
          return rowitem.StatusUpdatedBy && rowitem.StatusUpdatedBy !== '""' ? (
            <FieldUserRenderer
              users={JSON.parse(rowitem.StatusUpdatedBy)}
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
      name: "ConfirmationFromReceiver",
      displayName: "Confirmation from Receiver",
      minWidth: 100,
      maxWidth: 185,
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
              disabled={true}
              //disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "Field1",
      displayName: "ASN / Delivery Note",
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
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
      displayName: "Invoice",
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
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
      name: "Remarks",
      displayName: "Remarks",
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
      sorting: false,
      render: useCallback(
        (rowitem: IDistributionListItem) => {
          return (
            <Field
              component={FormikTextField}
              name={`formlvItems[${getIndexByID(rowitem.ID)}].Remarks`}
              styles={textFieldStyles}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "Created",
      displayName: "Create Time",
      minWidth: 120,
      maxWidth: 120,
      isResizable: true,
      sorting: true,
    },
    {
      name: "Actions",
      minWidth: 250,
      isResizable: true,
      render: (rowitem: IDistributionListItem) => {
        return (
          // Enable Reset Action
          // <Stack horizontal tokens={stackTokens}>
          //     <SubmitAction
          //         //disabled={isFreezed(rowitem.ID)}
          //         disabled={false}
          //         idx={getIndexByID(rowitem.ID)}
          //     />
          //     <ResetAction
          //         //disabled={isFreezed(rowitem.ID)}
          //         disabled={false}
          //         idx={getIndexByID(rowitem.ID)}
          //     />
          // </Stack>
          <Stack horizontal tokens={stackTokens}>
            <SubmitAction disabled={false} idx={getIndexByID(rowitem.ID)} />
            {/* <CancelAction
              disabled={isFreezedCancel(rowitem.ID)}
              idx={getIndexByID(rowitem.ID)}
            /> */}
          </Stack>
        );
      },
    },
  ];
  //#endregion
  const handleExportClick = (): void => {
    const headers = listviewFields.map((column) => ({
      label: column.displayName,
      key: column.name,
    }));

    const data = listviewItems.map((rowitem) => ({
      ...rowitem,
      StatusUpdatedBy:
        rowitem.StatusUpdatedBy !== '""'
          ? JSON.parse(rowitem.StatusUpdatedBy)[0].title
          : "",
    }));
    const csvContent = `data:text/csv;charset=utf-8,${toCSV(data, headers)}`;
    const encodedUri = encodeURI(csvContent);

    const aLink = document.createElement("a");
    const evt = new Event("click");

    aLink.download = "My Distributions";
    aLink.href = encodedUri;
    aLink.dispatchEvent(evt);
    aLink.click();
  };
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
          //validationSchema={formValidationSchema}
        >
          {(props) => (
            <Form>
              <FieldArray
                name="formlvItems"
                render={(arrayHelpers) => (
                  <div>
                    {props.values.formlvItems &&
                    props.values.formlvItems.length > 0 ? (
                      <>
                        <CommandBar
                          items={[
                            {
                              key: "export",
                              text: "Export to CSV",
                              iconProps: {
                                iconName: "excel-svg",
                                style: { width: 16 },
                              },
                              onClick: () => handleExportClick(),
                            },
                          ]}
                        />
                        <ListView
                          items={listviewItems}
                          viewFields={listviewFields}
                          selectionMode={SelectionMode.none}
                          showFilter={true}
                          filterPlaceHolder="Search..."
                          stickyHeader={true}
                          className={styles.listWrapper}
                          listClassName={styles.list}
                          compact={true}
                        />
                      </>
                    ) : null}
                    {props.errors && <AllErrors errors={props.errors} />}
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      ) : isFetchingDistribution === DistributionStatus.Idle ? (
        <SimpleEmpty>
          <span>{reminder}</span>
        </SimpleEmpty>
      ) : null}
    </>
  );
});
