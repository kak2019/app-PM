import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { initialState, EntitiesStatus } from "./entitiesSlice";
import { fetchEntitiesByTypeAction, fetchMyEntityAction } from "./action";
import { IEntitiesListItem } from "../../model";

const entitiesSlice = createSlice({
    name: FeatureKey.ENTITIES,
    initialState,
    reducers: {
        EntitiesStatusChanged(state, action) {
            state.status = action.payload;
        },
        EntitiesTypeChanged(state, action) {
            state.type = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyEntityAction.pending, (state, action)=>{
                state.status = EntitiesStatus.Loading;
            })
            .addCase(fetchMyEntityAction.fulfilled, (state, action)=>{
                state.status = EntitiesStatus.Idle;
                state.myentity = {...(action.payload as IEntitiesListItem)}
            })
            .addCase(fetchMyEntityAction.rejected, (state, action)=> {
                state.status= EntitiesStatus.Failed;
                state.message = action.error?.message;
            })
            .addCase(fetchEntitiesByTypeAction.pending,(state,action)=>{
                state.status = EntitiesStatus.Loading;
            })
            .addCase(fetchEntitiesByTypeAction.fulfilled,(state,action)=>{
                state.status = EntitiesStatus.Idle;
                state.items=[...(action.payload as readonly IEntitiesListItem[])]
            })
            .addCase(fetchEntitiesByTypeAction.rejected,(state,action)=>{
                state.status= EntitiesStatus.Failed;
                state.message = action.error?.message;
            })
    },

});

export const { EntitiesStatusChanged,EntitiesTypeChanged } = entitiesSlice.actions;
export const entitiesReducer = entitiesSlice.reducer;