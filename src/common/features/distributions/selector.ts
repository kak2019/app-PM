import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IDistributionState } from "./distributionsSlice";

const featureStateSelector = (state: RootState): object => state.distributions;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.statue
);

/**
 * message selector
 */
export const messageSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.message
);

/**
 * item selector
 */
export const itemSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.item
);

/**
 * items selector
 */
export const itemsSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.items
);

/**
 * itemId selector
 */
export const itemIdSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.itemId
);

/**
 * receiver selector
 */
export const receiverSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.receiver
);

/**
 * listId selector
 */
export const listIdSelector = createSelector(
    featureStateSelector,
    (state: IDistributionState) => state?.listId
);