import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/profiles";
import { getSP } from "../pnpjsConfig";
import { ISiteUserInfo } from '@pnp/sp/site-users/';


type UserOperators = [userPicture: string];

export const useUser = (userId: string): Readonly<UserOperators> => {
  let userPicture = "";
  let userInfo:ISiteUserInfo = null;
  const func = async (): Promise<void> => {
    const sp = spfi(getSP());
    await sp.web
      .getUserById(+userId)()
      .then((r) => {
        userInfo = { ...r };
      })
      .catch(console.log);
    const propertyName = "PictureURL";
    await sp.profiles
      .getUserProfilePropertyFor(userInfo.LoginName, propertyName)
      .then((property) => {
        userPicture = property;
      })
      .catch(console.log);
  };
  if(userId !== "" && userId!== undefined)
  {
    func().catch(console.log);
  }
  return [userPicture] as const;
};
