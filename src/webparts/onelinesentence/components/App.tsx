import * as React from "react";
import { useContext, memo, useEffect } from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import AppContext from "../../../common/AppContext";
import { useEntities } from "../../../common/hooks";
import { Label } from "office-ui-fabric-react";

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
  admin:"Admin"
};

export default memo(function App() {
  const ctx = useContext(AppContext);
  const userEmail = ctx.context?._pageContext?._user?.email;
  //const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
  const [roleColor,setroleColor] = React.useState<string>("black")
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
  const [userRoleText,setuserRoleText] = React.useState<string>("")
  //const [viewVisible, setviewVisible] = React.useState<boolean>(false);
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
            setuserRoleText("Supplier");
            setroleColor("#800000")
            break;
          case USER_ROLE.terminal:
            setuserRoleobj({
              ...userRoleobj,
              CreateFlowV: false,
              RequestFlowV: false,
              GoodIssueV: true,
            });
            setuserRoleText("Terminal");
            setroleColor("#800080")
            break;
          case USER_ROLE.fc:
            setuserRoleobj({
              ...userRoleobj,
              CreateFlowV: true,
              RequestFlowV: true,
            });
            setuserRoleText("Factory");
            setroleColor("#006400")
            break;
          case USER_ROLE.kdfc:
            setuserRoleobj({ ...userRoleobj });
            setuserRoleText("KD Factory");
            setroleColor("#FF00FF")
            break;
          case USER_ROLE.wh:
            setuserRoleobj({ ...userRoleobj });
            setuserRoleText("SPOL");
            setroleColor("#0000CD")
            break;
          case USER_ROLE.admin:
            setuserRoleobj({...userRoleobj,
              CreateFlowV: true,
              RequestFlowV: true,
              GoodIssueV: true,
            });
            setuserRoleText("Admin");
            setroleColor("#FF0000")
            break;
          default:
            break;
        }
      });
      //setviewVisible(true);
    }
  }, [groups]);

  

  return (
    <section>
      <Stack horizontal>
        {/* {webURL} */}
      {userRoleText !==""&&<Label style={{fontSize:16}}>Hello, you have logged in as {<span style={{color:roleColor}}>{userRoleText}.</span>}</Label>}</Stack>
    </section>
  );
});
