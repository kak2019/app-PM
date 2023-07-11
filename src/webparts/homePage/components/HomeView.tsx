import * as React from 'react';
import styles from './HomePage.module.scss';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { getSP } from './pnpjsConfig';
import { spfi } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { IWebEnsureUserResult } from '@pnp/sp/site-users/types';
import { ISiteUser } from "@pnp/sp/site-users/";
import { useContext } from "react";
import AppContext from '../../../common/AppContext';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
export default function HomePageView():JSX.Element {
    interface IuserRoleobj {
        CreateFlowV: boolean;
        RequestFlowV: boolean;
        GoodIssueV: boolean;
        CreateDistributionV: boolean;
        MyDistributionV: boolean;
        ReciecedDistributionV: boolean;
        InventoryV: boolean;
    }
    // const[userarrayList,setuserarrayList]  = React.useState([])
    const [viewVisible, setviewVisible] =React.useState<boolean>(false)
    const [userRoleobj, setuserRoleobj] = React.useState<IuserRoleobj>({
        CreateFlowV: false, RequestFlowV: false, GoodIssueV: true, CreateDistributionV: false,
        MyDistributionV: false, ReciecedDistributionV: false, InventoryV: false
    });
    const USER_ROLE = { supplier: "Supplier", terminal: "Terminal", fc: "Factory", kdfc: "KDFactory", wh: "WareHouse" }
    const userarray: string[] =[];
    const ctx = useContext(AppContext);
    const userEmail = ctx.context._pageContext._user.email;
    const webURL = ctx.context._pageContext._web.absoluteUrl;

    const init = async ():Promise<void> => {

        const sp = spfi(getSP());
        // // const { fetchData } = useProfile();
        // // const profileuser = await fetchData();
        // console.log("Accountname",profileuser.AccountName)
        const resultUser: IWebEnsureUserResult = await sp.web.ensureUser("i:0#.f|membership|" + userEmail);
        //console.log(resultManager)
        const Userpromise: ISiteUser = sp.web.getUserById(resultUser.data.Id);
        const CurrentUser = await Userpromise();
        console.log(CurrentUser)
        const users = sp.web.siteUsers.getById(CurrentUser.Id).groups;
        // const userinfo = users().then(response => { console.log(response[0].Title) })
        
         const userinfo1 = await users().then(response => {
            
            for (let i = 0; i < response.length; i++) {
                 userarray.push(response[i].Title)
            }
        })
        console.log("userinfo", userinfo1, typeof (userinfo1))
        console.log("userRoleArray", userarray,userarray.length)
        ///await setuserarrayList(userarray)
    }
    const checkbuttonV = ():void=> {
        
        if (userarray.length > 0) {
           console.log(userarray[0])
            switch (userarray[0]) {
                case USER_ROLE.supplier:
                    setuserRoleobj({
                        CreateFlowV: true, RequestFlowV: true, GoodIssueV: false, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: false, InventoryV: true
                    });
                    break;
                case USER_ROLE.terminal:
                    setuserRoleobj({
                        CreateFlowV: true, RequestFlowV: true, GoodIssueV: true, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: true, InventoryV: true
                    })
                    break;
                case USER_ROLE.fc:
                    setuserRoleobj({
                        CreateFlowV: true, RequestFlowV: true, GoodIssueV: false, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: true, InventoryV: true
                    })
                    break;
                case USER_ROLE.kdfc:
                    setuserRoleobj({
                        CreateFlowV: false, RequestFlowV: false, GoodIssueV: false, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: true, InventoryV: true
                    })
                    break;
                case USER_ROLE.wh:
                    setuserRoleobj({
                        CreateFlowV: false, RequestFlowV: false, GoodIssueV: false, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: true, InventoryV: true
                    })
                    break;
                default:
                    setuserRoleobj({
                        CreateFlowV: true, RequestFlowV: true, GoodIssueV: true, CreateDistributionV: true,
                        MyDistributionV: true, ReciecedDistributionV: true, InventoryV: true
                    })

            }
            console.log(userRoleobj)
        }
    }
    React.useEffect(() => {
      init().then(()=>{checkbuttonV();setviewVisible(true)}).catch(error=>console.log(error));
        
    }, []);
    // React.useEffect(()=>{
        
    // },[userarrayList])
    const stackStyles: IStackStyles = {
        root: {
            background: DefaultPalette.white,
            margin: 100
        },
    };
    // if need 
    // const getUrlFunction=()=>{
    //   window.location.href
    // }
    // const disabledvalue = true
    // const getCurrentUserRole = async ()=>{
    //   const users =  sp.web.siteUsers();//'flynt.gao@consultant.udtrucks.com'
    //   console.log(users)
    // }
    //getCurrentUserRole()
    return (
        <section >
            {viewVisible?<Stack enableScopedSelectors styles={stackStyles}>
                <DefaultButton text='Create New Request' className={userRoleobj.CreateFlowV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.CreateFlowV} href={`${webURL?webURL+"/":""}sitepages/request.aspx`} />

                <DefaultButton text='Request List' className={userRoleobj.RequestFlowV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.RequestFlowV} href={`${webURL?webURL+"/":""}Lists/Request%20List`} />

                <DefaultButton text='Goods Issue List' className={userRoleobj.GoodIssueV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.GoodIssueV} href={`${webURL?webURL+"/":""}sitepages/GI.aspx`} />

                <DefaultButton text='Create New Distribution Request' className={userRoleobj.CreateDistributionV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.CreateDistributionV} />

                <DefaultButton text='My Distribution Request' className={userRoleobj.MyDistributionV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.MyDistributionV} />

                <DefaultButton text='Received Distribution' className={userRoleobj.ReciecedDistributionV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.ReciecedDistributionV} />

                <DefaultButton text='Inventory Management' className={userRoleobj.InventoryV ? styles.homePageButton : styles.homePageButtonDisabled} disabled={!userRoleobj.InventoryV} href={`${webURL?webURL+"/":""}Lists/Inventory%20Management`} />
            </Stack>:<Spinner size={SpinnerSize.large} />}

        </section>
    );
}



