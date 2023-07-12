import { memo, useCallback, useEffect } from "react"
import { useEntities } from "../../../common/hooks";
import { useDistributions } from "../../../common/hooks/useDistributions";
import { EntitiesStatus } from "../../../common/features/entities";
import { DistributionStatus } from "../../../common/features/distributions";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import DFTlistview from "./DFTlistview";
import * as React from "react";
import LoadingBox from "../../../common/components/Box/LoadingBox";

export default memo(function App() {
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
        fetchDistributionListId();
        fetchMyEntity();
        fetchEntitiesByType({ type: "Terminal" });
    }, []);
    const showDFTView = useCallback((): boolean => {
        return true
    }, [myEntity, type, entities]);
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        function delay(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        async function waitForData() {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (typeof myEntity.Title === "undefined" || myEntity.Title === null) {
                    await delay(1000);
                }
                else {
                    if (distributionListId?.length > 0) {
                        fetchDistributionsBySender(myEntity.Title);
                    }
                    break;
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        // async function getData() {
        //     await waitForData();
        //     if (distributionListId?.length > 0) {
        //         fetchDistributionsBySender(myEntity.Title);
        //     }
        // }
        waitForData().catch(console.error);
    }, [myEntity, distributionListId]);
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