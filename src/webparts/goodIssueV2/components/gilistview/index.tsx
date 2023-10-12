import * as React from "react";
import { memo, useEffect, useContext, useState, useCallback } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
// import * as dayjs from "dayjs";
// import * as relativeTime from "dayjs/plugin/relativeTime";
import {
  ListView,
  IViewField,
  SelectionMode,
} from "@pnp/spfx-controls-react/lib/ListView";
import { useRequestsBundle } from "../../../../common/hooks/useRequestsBundle";
import styles from "./GIListView.module.scss";
import { IRequestListItem } from "../../../../common/model/requests";
import AppContext from "../../../../common/AppContext";
import { FieldUserRenderer } from "@pnp/spfx-controls-react";
import {
  CommandBar,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  Label,
  mergeStyleSets,
  registerIcons,
  Stack,
  TextField,
} from "office-ui-fabric-react";
import {
  REQUESTSCONST,
  RequestStatus,
} from "../../../../common/features/requestsBundlelist";
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
import { toCSV } from "../../../../common/components/toCSV";
import { QtySentField } from "./QtySentField";
import DialogCalculator from "../../../calculatorV2/components/DialogCalcaulator";
export default memo(function index() {
  const ctx = useContext(AppContext);
  // dayjs.extend(relativeTime);
  const [isFetchingRequest, , , requests, , , , , , , , , , ,] = useRequestsBundle();
  const [listviewItems, setListViewItems] =
    useState<IRequestListItem[]>(undefined);
  const [filterString1, setFilterString1] = useState("");
  const [filterString2, setFilterString2] = useState("");
  const [filterString3, setFilterString3] = useState("");
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [currentRow, setCurrentRow] = useState({})
  // const webURL = ctx.context?._pageContext?._web?.absoluteUrl;

  useEffect(() => {
    // Search on all columns
    // const items = filterString
    //   ? [...requests].filter((i) => {
    //       let key: keyof IRequestListItem;
    //       let result = false;
    //       for (key in i) {
    //         if (i[key].toString().toLowerCase().indexOf(filterString) > -1) {
    //           result = true;
    //           break;
    //         }
    //       }
    //       return result;
    //     })
    //   : [...requests];

    let items = [...requests];
    if (filterString1.length > 0) {
      items = items.filter((i) => {
        return (
          i.RequestNumber.toLowerCase().indexOf(filterString1.toLowerCase()) >
          -1
        );
      });
    }
    if (filterString2.length > 0) {
      items = items.filter((i) => {
        return i.DateNeeded.toString().indexOf(filterString2) > -1;
      });
    }

    if (filterString3.length > 0) {
      items = items.filter((i) => {
        return i.Status === filterString3;
      });
    }
    setListViewItems(items);
  }, [requests, filterString1, filterString2, filterString3]);

  const reminder = "You haven't receive any request flows";

  const getIndexByID = useCallback(
    (ID: string): number => {
      const res = requests.filter((i) => i.ID === ID);
      if (res.length > 0) {
        return requests.indexOf(res[0]);
      }
      return -1;
    },
    [requests]
  );

  const isFreezed = useCallback(
    (ID: string): boolean => {
      const res = requests.filter((i) => i.ID === ID);
      if (res.length > 0) {
        return (
          res[0].Status === "GI / In Transit" ||
          res[0].Status === "Completed" ||
          res[0].Status === "Req Rejected"
        );
      }
      return false;
    },
    [requests]
  );
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
      minWidth: 128,
      maxWidth: 128,
      isResizable: false,
      sorting: false,
    },
    {
      name: "BundleID",
      displayName: "Bundle ID",
      minWidth: 70,
      maxWidth: 70,
      isResizable: false,
      sorting: false,
    },
    {
      name: "BundleDescription",
      displayName: "Bundle Description",
      minWidth: 251,
      maxWidth: 251,
      isResizable: false,
      sorting: false,
    },
    {
      name: "Quantity",
      displayName: "Quantity",
      minWidth: 65,
      maxWidth: 65,
      isResizable: false,
      sorting: false,
      render: useCallback(
      (rowitem: IRequestListItem) => {
        return <div style={{cursor: 'pointer', color: 'blue'}} onClick={() => {
          console.log(rowitem)
          setIsShowDialog(true)
          setCurrentRow(rowitem);
          //console.log(rowitem.TerminalId)
        }}>{rowitem.Quantity}</div>
      },
      [listviewItems]
      ),
    },
    {
      name: "DateNeeded",
      displayName: "Date Needed",
      minWidth: 90,
      maxWidth: 90,
      isResizable: false,
      sorting: false,
      // render: useCallback(
      //   (rowitem: IRequestListItem) => {
      //     return dayjs(rowitem.DateNeeded).fromNow();
      //   },
      //   [listviewItems]
      // ),
    },
    {
      name: "Status",
      displayName: "Status",
      isResizable: false,
      sorting: false,
      minWidth: 130,
      maxWidth: 130,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          const readonlyStatus = isFreezed(rowitem.ID);
          return !readonlyStatus ? (
            <Field
              name={`formlvItems[${getIndexByID(rowitem.ID)}].Status`}
              component={FormikDropdown}
              styles={dropdownStyles}
              placeholder="Select a status"
              options={REQUESTSCONST.STATUS_OPTIONS}
              disabled={readonlyStatus}
            />
          ) : (
            <Dropdown
              disabled
              options={[
                { key: rowitem.Status, text: rowitem.Status, selected: true },
              ]}
              styles={dropdownStyles}
            />
          );
        },
        [listviewItems]
      ),
    },
    // {
    //   name: "FullOrPartialFilled",
    //   displayName: "Full / Partial Filled",
    //   isResizable: true,
    //   sorting: false,
    //   minWidth: 150,
    //   maxWidth: 210,
    //   render: useCallback(
    //     (rowitem: IRequestListItem) => {
    //       return (
    //         <Field
    //           name={`formlvItems[${getIndexByID(rowitem.ID)}].FullOrPartialFilled`}
    //           component={FormikDropdown}
    //           styles={dropdownStyles}
    //           placeholder="Select a option"
    //           options={REQUESTSCONST.FULLORPARTIAL_OPTIONS}
    //           disabled={isFreezed(rowitem.ID)}
    //         />
    //       );
    //     },
    //     [listviewItems]
    //   ),
    // },
    {
      name: "QtySent",
      displayName: "Qty Sent",
      minWidth: 110,
      maxWidth: 110,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          const idx = getIndexByID(rowitem.ID);
          return (
            <Field
              component={QtySentField}
              name={`formlvItems[${idx}].QtySent`}
              styles={narrowTextFieldStyles}
              disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "HowMuchCanBeFullfilled",
      displayName: "How much can be full filled",
      minWidth: 105,
      maxWidth: 185,
      isResizable: true,
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
      name: "DateByWhenItWillReach",
      displayName: "Date by when it will reach",
      minWidth: 175,
      maxWidth: 175,
      isResizable: false,
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
      minWidth: 60,
      maxWidth: 185,
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
              disabled={true}
              //disabled={isFreezed(rowitem.ID)}
            />
          );
        },
        [listviewItems]
      ),
    },
    {
      name: "Actions",
      minWidth: 230,
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
    {
      name: "Field1",
      displayName: "ASN / Delivery Note",
      minWidth: 160,
      maxWidth: 160,
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
      displayName: "Invoice",
      minWidth: 160,
      maxWidth: 160,
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
      name: "Remarks",
      displayName: "Remarks",
      minWidth: 160,
      maxWidth: 160,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
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
      name: "Requestor",
      displayName: "Created By",
      minWidth: 140,
      maxWidth: 140,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return rowitem.Requestor !== '""' ? (
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
      name: "Created",
      displayName: "Create Time",
      minWidth: 120,
      maxWidth: 120,
      isResizable: false,
      sorting: false,
      // render: useCallback(
      //   (rowitem: IRequestListItem) => {
      //     return dayjs(rowitem.Created).fromNow();
      //   },
      //   [listviewItems]
      // ),
    },
    {
      name: "RequesterId_x003a_Name",
      displayName: "Requestor",
      minWidth: 80,
      maxWidth: 120,
      isResizable: true,
      sorting: false,
    },
    // {
    //   name: "TerminalId_x003a_Name",
    //   displayName: "Terminal",
    //   minWidth: 80,
    //   maxWidth: 100,
    //   isResizable: true,
    //   sorting: false,
    // },
    {
      name: "DeliveryLocationAndCountry",
      displayName: "Delivery Location and Country",
      minWidth: 125,
      maxWidth: 205,
      isResizable: true,
      sorting: false,
    },
    {
      name: "StatusUpdateBy",
      displayName: "Status Update By",
      minWidth: 140,
      maxWidth: 140,
      isResizable: false,
      sorting: false,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return rowitem.StatusUpdateBy !== '""' ? (
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
  ];
  //#endregion
  const handleExportClick = (): void => {
    const headers = listviewFields.map((column) => ({
      label: column.displayName,
      key: column.name,
    }));

    const data = listviewItems.map((rowitem) => ({
      ...rowitem,
      Requestor:
        rowitem.Requestor !== '""'
          ? JSON.parse(rowitem.Requestor)[0].title
          : "",
      StatusUpdateBy:
        rowitem.StatusUpdateBy !== '""'
          ? JSON.parse(rowitem.StatusUpdateBy)[0].title
          : "",
    }));
    const csvContent = `data:text/csv;charset=utf-8,${toCSV(data, headers)}`;
    const encodedUri = encodeURI(csvContent);

    const aLink = document.createElement("a");
    const evt = new Event("click");

    aLink.download = "Goods Issue Bundle List";
    aLink.href = encodedUri;
    aLink.dispatchEvent(evt);
    aLink.click();
  };
  const handleFilterString1Change = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      if (!newValue || newValue.length <= 19) {
        setFilterString1(newValue || "");
      }
    },
    []
  );
  const handleFilterString2Change = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      if (!newValue || newValue.length <= 10) {
        setFilterString2(newValue || "");
      }
    },
    []
  );
  const handleFilterString3Change = React.useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption,
      index?: number
    ) => {
      if (index === 0) {
        setFilterString3("");
      } else {
        setFilterString3(option.text);
      }
    },
    []
  );
  return (
    <>
      <Stack
        horizontal
        tokens={stackTokens}
        styles={{ root: { width: "94vw" } }}
      >
        <Stack.Item grow disableShrink styles={{ root: { width: 890 } }}>
          <div className={styles.listViewSearchContainer}>
            <Stack horizontal tokens={stackTokens}>
              <Label>Request Number</Label>
              <TextField
                placeholder="Search"
                styles={{ root: { width: 100 } }}
                value={filterString1}
                onChange={handleFilterString1Change}
              />
              <Label>Dated needed</Label>
              <TextField
                placeholder="Search"
                styles={{ root: { width: 100 } }}
                value={filterString2}
                onChange={handleFilterString2Change}
              />
              <Label>Status</Label>
              <Dropdown
                placeholder="Search"
                selectedKey={filterString3 || "All"}
                options={[
                  { key: "All", text: "<All>" },
                  { key: "Req Received", text: "Req Received" },
                  { key: "Req Accepted", text: "Req Accepted" },
                  { key: "Req Rejected", text: "Req Rejected" },
                  { key: "GI / In Transit", text: "GI / In Transit" },
                  { key: "Completed", text: "Completed" },
                ]}
                styles={dropdownStyles}
                onChange={handleFilterString3Change}
              />
            </Stack>
          </div>
        </Stack.Item>
        <Stack.Item grow={3}>&nbsp;</Stack.Item>
        <Stack.Item
          grow
          disableShrink
          styles={{
            root: {
              width: 130,
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <CommandBar
            items={[
              {
                key: "export",
                text: "Export to CSV",
                split: true,
                ariaLabel: "Export",
                iconProps: {
                  iconName: "excel-svg",
                  style: { width: 16 },
                },
                disabled: listviewItems?.length === 0,
                onClick: () => handleExportClick(),
              },
              // {
              //   key: "back",
              //   text: "Return to Homepage",
              //   iconProps: { iconName: "ReturnKey" },
              //   href: "" + webURL,
              // },
            ]}
            aria-label="GI actions"
          />
        </Stack.Item>
      </Stack>
      {listviewItems?.length > 0 ? (
        <Formik
          initialValues={{ formlvItems: requests }}
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
                        // showFilter={true}
                        // filterPlaceHolder="Search..."
                        stickyHeader={true}
                        className={styles.listWrapper}
                        listClassName={styles.list}
                        compact={true}
                      />
                    ) : null}
                    {props.errors && <AllErrors errors={props.errors} />}
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      ) : isFetchingRequest === RequestStatus.Idle ? (
        requests?.length === 0 ? (
          <SimpleEmpty>
            <span>{reminder}</span>
          </SimpleEmpty>
        ) : (
          <ListView
            items={[]}
            viewFields={listviewFields}
            // selectionMode={SelectionMode.none}
            // stickyHeader={true}
            className={styles.listWrapper}
            listClassName={styles.list}
            compact={true}
          />
        )
      ) : null}
      <DialogCalculator row={currentRow} showDialog={isShowDialog} toggleHideDialog={() => {setIsShowDialog(!isShowDialog)}} />
    </>
  );
  
});
