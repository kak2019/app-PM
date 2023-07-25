import * as React from "react";
import { useContext, memo, useEffect } from "react";
import styles from "./HomePage.module.scss";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack, IStackStyles } from "@fluentui/react/lib/Stack";
import { DefaultPalette } from "@fluentui/react/lib/Styling";
import AppContext from "../../../common/AppContext";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { useEntities } from "../../../common/hooks";
import { IIconProps } from "office-ui-fabric-react";

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
const addIcon: IIconProps = {iconName: 'Add' };

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
              CreateFlowV: true,
              RequestFlowV: true,
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
      margin: 100,
    },
  };

  return (
    <section>
      {viewVisible ? (
        <Stack enableScopedSelectors styles={stackStyles}>
          <Stack>
          Request
          <DefaultButton
            text="Create New Request"
            className={
              userRoleobj.CreateFlowV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.CreateFlowV}
            href={`${webURL ? webURL + "/" : ""}sitepages/request.aspx`}
            iconProps={addIcon}
          />

          <DefaultButton
            text="Request List"
            className={
              userRoleobj.RequestFlowV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.RequestFlowV}
            href={`${webURL ? webURL + "/" : ""}Lists/Request%20List`}
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
          />
  </Stack>
          <DefaultButton
            text="Create New Distribution Request"
            className={
              userRoleobj.CreateDistributionV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.CreateDistributionV}
            href={`${webURL ? webURL + "/" : ""}sitepages/Distribute-flow.aspx`}
          />

          <DefaultButton
            text="My Distribution Request"
            className={
              userRoleobj.MyDistributionV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.MyDistributionV}
            href={`${webURL ? webURL + "/" : ""}sitepages/Distribution-Flow-Tracker.aspx`}
          />

          <DefaultButton
            text="Received Distribution"
            className={
              userRoleobj.ReciecedDistributionV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.ReciecedDistributionV}
            href={`${webURL ? webURL + "/" : ""}Lists/Distribution%20List`}
          />

          <DefaultButton
            text="Inventory Management"
            className={
              userRoleobj.InventoryV
                ? styles.homePageButton
                : styles.homePageButtonDisabled
            }
            disabled={!userRoleobj.InventoryV}
            href={`${webURL ? webURL + "/" : ""}Lists/Inventory%20Management`}
          />
        </Stack>
      ) : (
        <Spinner size={SpinnerSize.large} />
      )}
    </section>
  );
});
