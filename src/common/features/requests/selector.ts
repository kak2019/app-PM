import { createSelector } from "@reduxjs/toolkit";
import { IRequestState } from "./requestsSlice";
import { RootState } from "../../store";

const featureStateSelector = (state: RootState): object => state.requests;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.statue
);

/**
 * message selector
 */
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.message
);

/**
 * item selector
 */
export const itemSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.item
);

/**
 * items selector
 */
export const itemsSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.items
);

/**
 * itemId selector
 */
export const itemIdSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.itemId
);

/**
 * TermialId selector
 */
export const termialIdSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.terminalId
);

/**
 * listId selector
 */
export const listIdSelector = createSelector(
  featureStateSelector,
  (state: IRequestState) => state?.listId
);
