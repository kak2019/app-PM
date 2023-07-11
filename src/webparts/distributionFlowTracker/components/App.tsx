import { memo, useCallback, useContext, useEffect } from "react"
import AppContext from "../../../common/AppContext"
import { useEntities } from "../../../common/hooks";
import { useDistributions } from "../../../common/hooks/useDistributions";
import { IPrincipal } from "@pnp/spfx-controls-react";
import { EntitiesStatus } from "../../../common/features/entities";
import { DistributionStatus } from "../../../common/features/distributions";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import DFTlistview from "./DFTlistview";
import * as React from "react";
import LoadingBox from "../../../common/components/Box/LoadingBox";

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
        errorMessage
    ] = useEntities();
    const [
        isFetchingDistribution,
        errorMessageDistribution,
        ,
        ,
        ,
        ,
        ,
        fetchDistributionsBySender,
        ,
        distributionListId,
        fetchDistributionListId,
        ,
        ,
        ,
    ] = useDistributions();
    useEffect(() => {
        fetchMyEntity();
        fetchDistributionListId();
    }, []);
    useEffect(() => {
        if (distributionListId?.length > 0) {
            fetchDistributionsBySender(myEntity.Title);
        }
    }, [myEntity, distributionListId]);
    const showDFTView = useCallback((): boolean => {
        return true
    }, [myEntity, type, entities]);
    const isLoading =
        isFetching === EntitiesStatus.Loading ||
        isFetchingDistribution === DistributionStatus.Loading;

    return (
        <>
            <LoadingBox isOpen={isLoading} infoDetails={"Loading data..."} />
            {errorMessage?.length !== 0 && (
                <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                    {errorMessage}
                </MessageBar>
            )}
            {errorMessageDistribution?.length !== 0 && (
                <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                    {errorMessage}
                </MessageBar>
            )}
            {showDFTView() && <DFTlistview />}
        </>
    )
})