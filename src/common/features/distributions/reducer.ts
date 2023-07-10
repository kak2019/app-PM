import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { DistributionStatus, initialState } from "./distributionsSlice";
import {
    fetchByIdAction,
    fetchByReceiverAction,
    fetchDistributionListIdAction,
    editDistributionAction,
    addDistributionAction
} from "./action"
import { IDistributionListItem } from "../../model";

const distributionsSlice = createSlice({
    name: FeatureKey.DISTRIBUTIONS,
    initialState,
    reducers: {
        DistributionStatusChanged(state, action) {
            state.statue = action.payload;
        },
        DistributionItemChanged(state, action) {
            state.item = action.payload;
        },
        DistributionItemIdChanged(state, action) {
            state.itemId = action.payload;
        },
        DistributionListIdChange(state, action) {
            state.listId = action.payload;
        },
        DistributionReceiverChange(state, action) {
            state.receiver = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDistributionListIdAction.pending, (state, action) => {
                state.statue = DistributionStatus.Loading;
            })
            .addCase(fetchDistributionListIdAction.fulfilled, (state, action) => {
                state.statue = DistributionStatus.Idle;
                state.listId = action.payload as string;
            })
            .addCase(fetchDistributionListIdAction.rejected, (state, action) => {
                state.statue = DistributionStatus.Failed;
                state.message = action.error?.message;
            })
            .addCase(fetchByIdAction.pending, (state, action) => {
                state.statue = DistributionStatus.Loading;
            })
            .addCase(fetchByIdAction.fulfilled, (state, action) => {
                state.statue = DistributionStatus.Idle;
                state.item = action.payload as IDistributionListItem;
            })
            .addCase(fetchByIdAction.rejected, (state, action) => {
                state.statue = DistributionStatus.Failed;
                state.message = action.error?.message;
            })
            .addCase(fetchByReceiverAction.pending, (state, action) => {
                state.statue = DistributionStatus.Loading;
            })
            .addCase(fetchByReceiverAction.fulfilled, (state, action) => {
                state.statue = DistributionStatus.Idle;
                state.items = [...(action.payload as readonly IDistributionListItem[])];
            })
            .addCase(fetchByReceiverAction.rejected, (state, action) => {
                state.statue = DistributionStatus.Failed;
                state.message = action.error?.message;
            })
            .addCase(addDistributionAction.pending, (state, action) => {
                state.statue = DistributionStatus.Loading;
            })
            .addCase(addDistributionAction.fulfilled, (state, action) => {
                const { distribution } = action.meta.arg;
                state.statue = DistributionStatus.Idle;
                state.item = distribution;
            })
            .addCase(addDistributionAction.rejected, (state, action) => {
                state.statue = DistributionStatus.Failed;
                state.message = action.error?.message;
            })
            .addCase(editDistributionAction.pending, (state, action) => {
                state.statue = DistributionStatus.Loading;
            })
            .addCase(editDistributionAction.fulfilled, (state, action) => {
                state.statue = DistributionStatus.Idle;
                state.item = action.payload as IDistributionListItem;
            })
            .addCase(editDistributionAction.rejected, (state, action) => {
                state.statue = DistributionStatus.Failed;
                state.message = action.error?.message;
            })
    }
});
export const { DistributionStatusChanged, DistributionItemChanged, DistributionItemIdChanged, DistributionListIdChange, DistributionReceiverChange } = distributionsSlice.actions;
export const distributionsReducer = distributionsSlice.reducer;