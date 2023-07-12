import * as React from "react";
import { memo, useEffect } from "react";
import { useEntities } from "../../../common/hooks";
import "./App.css";
import { EntitiesStatus } from "../../../common/features/entities";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import { useRequests } from "../../../common/hooks/useRequests";
import { RequestStatus } from "../../../common/features/requests";
import GIListView from "./gilistview";
import LoadingBox from "../../../common/components/Box/LoadingBox";

export default memo(function App() {
  const [
    isFetching,
    ,
    fetchMyEntity,
    ,
    myEntity,
    ,
    errorMessage,
    ,
    ,
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
    ,
    ,
    ,
    ,
    ,
  ] = useRequests();

  useEffect(() => {
    fetchMyEntity();
  }, []);
  useEffect(() => {
    if (myEntity?.Type === "Terminal") {
      fetchRequestsByTermialId(myEntity.Title);
    }
  }, [myEntity]);

  const showGIView = (): boolean => {
      let isTerminalUser = false;
      if (myEntity?.Type === "Terminal") isTerminalUser = true;
      return isTerminalUser;
  };
  const isLoading =
    isFetching === EntitiesStatus.Loading ||
    isFetchingRequest === RequestStatus.Loading;

  return (
    <>
      <LoadingBox isOpen={isLoading} infoDetails={"Loading data..."} />
      {showGIView() && <GIListView />}
      {errorMessage?.length !== 0 && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessage}
        </MessageBar>
      )}
      {errorMessageRequest?.length !== 0 && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
          {errorMessageRequest}
        </MessageBar>
      )}
    </>
  );
});
