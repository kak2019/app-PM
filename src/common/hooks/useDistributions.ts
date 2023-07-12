import { useCallback } from "react";
import {
    addDistributionAction,
    DistributionItemIdChanged,
    DistributionListIdChange,
    DistributionSenderChange,
    DistributionStatus,
    editDistributionAction,
    fetchByIdAction,
    fetchBySenderAction,
    fetchDistributionListIdAction,
    isFetchingSelector, itemIdSelector,
    itemSelector,
    itemsSelector,
    listIdSelector,
    messageSelector,
    senderSelector
} from "../features/distributions";
import { IDistributionListItem } from "../model";
import { useAppDispatch, useAppSelector } from "./useApp";

type DistributionsOperators = [
    isFetching: DistributionStatus,
    errorMessage: string,
    distribution: IDistributionListItem,
    distributions: IDistributionListItem[],
    distributionItemId: string,
    distributionSender: string,
    fetchDistributionById: (Id: number) => void,
    fetchDistributionsBySender: (Sender: string) => void,
    addDistribution: (arg: { distribution: IDistributionListItem }) => Promise<number>,
    distributionListId: string,
    fetchDistributionListId: () => void,
    changeDistributionId: (Id: string) => void,
    changeDistributionListId: (Id: string) => void,
    editDistribution: (arg: { distribution: any }) => Promise<number>
];
export const useDistributions = (): Readonly<DistributionsOperators> => {
    const dispatch = useAppDispatch();
    const distribution = useAppSelector(itemSelector);
    const distributions = useAppSelector(itemsSelector);
    const distributionItemId = useAppSelector(itemIdSelector);
    const distributionSender = useAppSelector(senderSelector);
    const distributionListId = useAppSelector(listIdSelector);
    const isFetching = useAppSelector(isFetchingSelector);
    const errorMessage = useAppSelector(messageSelector);

    const fetchDistributionById = useCallback(
        (Id: number) => {
            dispatch(DistributionItemIdChanged(Id));
            return dispatch(fetchByIdAction({ Id }));
        },
        [dispatch]
    );
    const fetchDistributionsBySender = useCallback(
        (Sender: string) => {
            dispatch(DistributionSenderChange(Sender));
            return dispatch(fetchBySenderAction({ Sender }));
        },
        [dispatch]
    );
    const addDistribution = useCallback(
        async (arg: { distribution: IDistributionListItem }) => {
            try {
                await dispatch(addDistributionAction(arg));
                return 0;
            } catch {
                return Promise.reject(1);
            }
        },
        [dispatch]
    );
    const editDistribution = useCallback(
        async (arg: { distribution: any }) => {
            try {
                await dispatch(editDistributionAction(arg));
                return 0;
            } catch {
                return Promise.reject(1);
            }
        },
        [dispatch]
    );
    const fetchDistributionListId = useCallback(async () => {
        return dispatch(fetchDistributionListIdAction());
    }, [dispatch]);
    const changeDistributionId = useCallback((Id: string) => {
        return dispatch(DistributionItemIdChanged(Id));
    }, [dispatch]);
    const changeDistributionListId = useCallback(
        async (Id: string) => {
            return dispatch(DistributionListIdChange(Id));
        },
        [dispatch]
    );
    return [
        isFetching,
        errorMessage,
        distribution,
        distributions,
        distributionItemId,
        distributionSender,
        fetchDistributionById,
        fetchDistributionsBySender,
        addDistribution,
        distributionListId,
        fetchDistributionListId,
        changeDistributionId,
        changeDistributionListId,
        editDistribution
    ]
};