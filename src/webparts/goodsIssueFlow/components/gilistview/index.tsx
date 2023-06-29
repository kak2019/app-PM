import * as React from "react";
import { memo, useState, useEffect, useContext, useCallback } from "react";
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
  Dropdown,
  TextField,
  Checkbox,
  DatePicker,
  IDropdownStyles,
  mergeStyleSets,
} from "office-ui-fabric-react";
import { REQUESTSCONST } from "../../../../common/features/requests";

export default memo(function index() {
  const ctx = useContext(AppContext);
  const userEmail = ctx.context._pageContext._user.email;
  console.log(userEmail);
  const [, , , requests, , , , , , , , , , ,] = useRequests();
  const [listviewItems, setListViewItems] =
    useState<IRequestListItem[]>(undefined);

  const dataPickerClass = mergeStyleSets({
    control: {
      maxWidth: "300px",
      minWidth: "165px",
    },
  });
  const onFormatDate = (date?: Date): string => {
    return !date ? '' : (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
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
      render: useCallback(
        (rowitem: IRequestListItem) => {
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
        [listviewItems]
      ),
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
      name: "Status",
      displayName: "Status",
      isResizable: true,
      sorting: true,
      minWidth: 150,
      maxWidth: 210,
      render: useCallback(
        (rowitem) => {
          return (
            <Dropdown
              defaultSelectedKey={rowitem.Status}
              styles={dropdownStyles}
              placeholder="Select a status"
              options={REQUESTSCONST.STATUS_OPTIONS}
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
      sorting: true,
      minWidth: 150,
      maxWidth: 210,
      render: useCallback(
        (rowitem) => {
          return (
            <Dropdown
              defaultSelectedKey={rowitem.FullOrPartialFilled}
              styles={dropdownStyles}
              placeholder="Select a option"
              options={REQUESTSCONST.FULLORPARTIAL_OPTIONS}
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            (
              <FieldUserRenderer
                users={JSON.parse(rowitem.StatusUpdateBy)}
                context={ctx.context}
              />
            ) || ""
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return <TextField value={rowitem.QtySent + ""} width={95} /> || "";
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <DatePicker
              value={rowitem.DateByWhenItWillReach}
              className={dataPickerClass.control}
              formatDate={onFormatDate}
              placeholder="Select a date..."
              ariaLabel="Select a date"
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return (
            <Checkbox defaultChecked={rowitem.ConfirmationFromSupplier==="Yes"}
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return <TextField value={rowitem.Field1} width={135} /> || "";
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
      sorting: true,
      render: useCallback(
        (rowitem: IRequestListItem) => {
          return <TextField value={rowitem.Field2} width={135} /> || "";
        },
        [listviewItems]
      ),
    },
  ];

  useEffect(() => {
    setListViewItems([...requests]);
  }, [requests]);

  return (
    <div style={{ flex: "0 0 auto" }}>
      {requests?.length > 0 && (
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
      )}
    </div>
  );
});
