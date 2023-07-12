import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IEntitiesState } from "./entitiesSlice";

const featureStateSelector = (state: RootState): object => state.entities;

/**
 * isFetching selector
 */
export const isFetchingSelector = createSelector(
    featureStateSelector,
    (state: IEntitiesState) => state?.status
);

/**
 * message selector
 */
export const messageSelector = createSelector(
    featureStateSelector,
    (state: IEntitiesState) => state?.message
);

/**
 * type selector
 */
export const typeSelector = createSelector(
    featureStateSelector,
    (state: IEntitiesState) => state?.type
);

/**
 * my entity selector
 */
export const myEntitySelector = createSelector(
    featureStateSelector,
    (state:IEntitiesState)=>state?.myentity
);

/**
 * all entities by type selector
 */
export const allEntitiesByTypeSelector = createSelector(
    featureStateSelector,
    (state:IEntitiesState)=>state?.items
);

/**
 * groups by userEmail selector
 */
export const groupsSelector = createSelector(
    featureStateSelector,
    (state:IEntitiesState)=>state?.groups
);
