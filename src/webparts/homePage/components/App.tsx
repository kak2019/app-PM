import * as React from "react";
import { useContext, memo, useEffect } from "react";
import styles from "./HomePage.module.scss";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackStyles } from "@fluentui/react/lib/Stack";
import { DefaultPalette } from "@fluentui/react/lib/Styling";
import AppContext from "../../../common/AppContext";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { useEntities } from "../../../common/hooks";

import NewDistribution from '../assets/newDistribution'
import RequestListSvg from '../assets/requestlist'
import GoodIssue from '../assets/goodissue'
import Inventory from '../assets/inventory'
import MyDisribution from '../assets/myDisribution'
import EditDocument from '../assets/editDocument'
import Receive from '../assets/receive'
import ViewHistory from '../assets/viewhistory'
import InvoiceIcon from  '../assets/InvoiceIcon'

interface IuserRoleobj {
  CreateFlowV: boolean;
  RequestFlowV: boolean;
  GoodIssueV: boolean;
  CreateDistributionV: boolean;
  MyDistributionV: boolean;
  ReciecedDistributionV: boolean;
  InventoryV: boolean;
}
const USER_ROLE = {
  supplier: "Supplier",
  terminal: "Terminal",
  fc: "Factory",
  kdfc: "KDFactory",
  wh: "WareHouse",
};

export default memo(function App() {
  const ctx = useContext(AppContext);
  const userEmail = ctx.context?._pageContext?._user?.email;
  const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
  const [
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    groups,
    fetchGroupsByUserEmail,
  ] = useEntities();

  const [viewVisible, setviewVisible] = React.useState<boolean>(false);
  const [userRoleobj, setuserRoleobj] = React.useState<IuserRoleobj>({
    CreateFlowV: false,
    RequestFlowV: false,
    GoodIssueV: false,
    CreateDistributionV: true,
    MyDistributionV: true,
    ReciecedDistributionV: true,
    InventoryV: true,
  });

  useEffect(() => {
    if(userEmail!=="" && userEmail!==undefined) fetchGroupsByUserEmail({ userEmail});
  }, []);
  useEffect(() => {
    if (groups.length > 0) {
      groups.map((g) => {
        switch (g) {
          case USER_ROLE.supplier:
            setuserRoleobj({
              ...userRoleobj,
              CreateFlowV: true,
              RequestFlowV: true,
              ReciecedDistributionV: false,
            });
            break;
          case USER_ROLE.terminal:
            setuserRoleobj({
              ...userRoleobj,
              CreateFlowV: false,
              RequestFlowV: false,
              GoodIssueV: true,
            });
            break;
          case USER_ROLE.fc:
            setuserRoleobj({
              ...userRoleobj,
              CreateFlowV: true,
              RequestFlowV: true,
            });
            break;
          case USER_ROLE.kdfc:
            setuserRoleobj({ ...userRoleobj });
            break;
          case USER_ROLE.wh:
            setuserRoleobj({ ...userRoleobj });
            break;
          default:
            break;
        }
      });
      setviewVisible(true);
    }
  }, [groups]);

  const stackStyles: IStackStyles = {
    root: {
      background: DefaultPalette.white,
      margin: 0,
    },
  };
  

  return (
    <section>
      {viewVisible ? (
        <Stack enableScopedSelectors styles={stackStyles}>
          <div className={styles.section} style={{display:(userRoleobj.CreateFlowV||userRoleobj.RequestFlowV||userRoleobj.GoodIssueV)?"block":"none"}}>
            {/* <div className={styles.parttitle} style={{display:(userRoleobj.CreateFlowV||userRoleobj.RequestFlowV||userRoleobj.GoodIssueV)?"block":"none"}}>Request</div> */}
            <Stack enableScopedSelectors horizontal horizontalAlign="start">
            
            <DefaultButton
              text="Incoming"
              className={
                userRoleobj.CreateFlowV
                  ? styles.homePageButton
                  : styles.homePageButtonDisabled
              }
              disabled={!userRoleobj.CreateFlowV}
              href={`${webURL ? webURL + "/" : ""}sitepages/request.aspx`}
              onRenderIcon={() => {
                return <EditDocument />
              }}
            />

            <DefaultButton
              text="Incoming List"
              className={
                userRoleobj.RequestFlowV
                  ? styles.homePageButton
                  : styles.homePageButtonDisabled
              }
              disabled={!userRoleobj.RequestFlowV}
              href={`${webURL ? webURL + "/" : ""}Lists/Request%20List`}
              onRenderIcon={() => {
                return <RequestListSvg />
              }}
            />

            <DefaultButton
              text="Goods Issue List"
              className={
                userRoleobj.GoodIssueV
                  ? styles.homePageButton
                  : styles.homePageButtonDisabled
              }
              disabled={!userRoleobj.GoodIssueV}
              href={`${webURL ? webURL + "/" : ""}sitepages/GI.aspx`}
              onRenderIcon={() => {
                return <GoodIssue />
              }}
            />
          </Stack>
          </div>

          <div className={styles.section}>
            {/* <div className={styles.parttitle}>Distribution</div> */}
              <Stack enableScopedSelectors horizontal horizontalAlign="start">
              <DefaultButton
                text="Outgoing"
                className={
                  userRoleobj.CreateDistributionV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                disabled={!userRoleobj.CreateDistributionV}
                href={`${webURL ? webURL + "/" : ""}sitepages/Distribute-flow.aspx`}
                onRenderIcon={() => {
                  return <NewDistribution />
                }}
              />

              <DefaultButton
                text="My Distributions"
                className={
                  userRoleobj.MyDistributionV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                disabled={!userRoleobj.MyDistributionV}
                href={`${webURL ? webURL + "/" : ""}sitepages/Distribution-Flow-Tracker.aspx`}
                onRenderIcon={() => {
                  return <MyDisribution />
                }}
              />

              <DefaultButton
                text="Received Distributions"
                className={
                  userRoleobj.ReciecedDistributionV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                disabled={!userRoleobj.ReciecedDistributionV}
                href={`${webURL ? webURL + "/" : ""}Lists/Distribution%20List`}
                onRenderIcon={() => {
                  return <Receive />
                }}
              />
              </Stack>
          </div>

          <div className={styles.section}>
            {/* <div className={styles.parttitle}>Inventory </div> */}
            <Stack enableScopedSelectors horizontal horizontalAlign="start">
              <DefaultButton
                text="Stock Reports"
                className={
                  userRoleobj.InventoryV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                disabled={!userRoleobj.InventoryV}
                href={`${webURL ? webURL + "/" : ""}Lists/Inventory%20Management`}
                onRenderIcon={() => {
                  return <Inventory />
                }}
              />
              <DefaultButton
                text="View History"
                className={
                  userRoleobj.InventoryV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                //disabled={!userRoleobj.InventoryV}
                href={`${webURL ? webURL + "/" : ""}Lists/Inventory%20History`}
                onRenderIcon={() => {
                  return <ViewHistory />
                }}
              />
            </Stack>
          </div>

          <div className={styles.section}>
          <Stack enableScopedSelectors horizontal horizontalAlign="start">
          <DefaultButton
                text="Invoice Print Out"
                className={
                  userRoleobj.InventoryV
                    ? styles.homePageButton
                    : styles.homePageButtonDisabled
                }
                disabled={!userRoleobj.InventoryV}
                //href={`${webURL ? webURL + "/" : ""}Lists/Inventory%20Management`}
                onRenderIcon={() => {
                  return <InvoiceIcon/>
                }}
              />
            </Stack>
          </div>
        </Stack>
      ) : (
        <Spinner size={SpinnerSize.large} />
      )}
    </section>
  );
});
