import * as React from "react";
import { memo, useContext, useEffect, useCallback } from "react";
import { useEntities } from "../../../common/hooks";
import AppContext from "../../../common/AppContext";
// import "./App.css";
import { EntitiesStatus } from "../../../common/features/entities";
import {
  MessageBar,
  MessageBarType,
  ProgressIndicator,
} from "office-ui-fabric-react";
import { useRequests } from "../../../common/hooks/useRequests";
import { RequestStatus } from "../../../common/features/requests";
import GIListView from "./gilistview";
import { IPrincipal } from "@pnp/spfx-controls-react";


export default memo(function App() {
  const ctx = useContext(AppContext);
  const userEmail = ctx.context._pageContext._user.email;
  const [
    isFetching,
    type,
    fetchMyEntity,
    fetchEntitiesByType,
    myEntity,
    entities,
    errorMessage,
  ] = useEntities();
  const [
    isFetchingRequest,
    errorMessageRequest,
    ,
    ,
    ,
    ,
    ,
    fetchRequestsByTermialId,
    ,
    requestListId,
    fetchRequestListId,
    ,
    ,
    ,
  ] = useRequests();

  useEffect(() => {
    fetchMyEntity();
    fetchEntitiesByType({ type: "Terminal" });
    fetchRequestListId();
  }, []);
  useEffect(() => {
    if (myEntity?.Type === "Terminal" && requestListId.length > 0) {
      fetchRequestsByTermialId(myEntity.Title);
    }
  }, [myEntity, requestListId]);

  const showGIView = useCallback((): boolean => {
    if (type === "Terminal") {
      let isTerminalUser = false;
      entities.every((t) => {
        (JSON.parse(t.Users) as IPrincipal[]).every((u:IPrincipal) => {
          if (u.email === userEmail) {
            isTerminalUser = true;
            return false;
          }
          return true;
        });
        if (isTerminalUser) return false;
        return true;
      });
      if (myEntity?.Type === "Terminal") isTerminalUser = true;
      return isTerminalUser;
    }
    return false;
  }, [myEntity, type, entities]);

  return (
    <>
      <ProgressIndicator
        progressHidden={
          !(
            isFetching === EntitiesStatus.Loading ||
            isFetchingRequest === RequestStatus.Loading
          )
        }
      />
      {errorMessage.length !== 0 && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessage}
        </MessageBar>
      )}
      {errorMessageRequest.length !== 0 && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessageRequest}
        </MessageBar>
      )}
      {!isFetching && showGIView() && <GIListView/>}
    </>
  );
});
