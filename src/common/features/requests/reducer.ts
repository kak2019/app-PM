import { createSlice } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import {
  fetchByIdAction,
  fetchByTermialIdAction,
  addRequestAction,
  editRequestAction,
  fetchRequestListIdAction,
} from "./action";
import { initialState, RequestStatus } from "./requestsSlice";
import { IRequestListItem } from "../../model";

const requestsSlice = createSlice({
  name: FeatureKey.REQUESTS,
  initialState,
  reducers: {
    RequestStatusChanged(state, action) {
      state.statue = action.payload;
    },
    RequestItemChanged(state, action) {
      state.item = action.payload;
    },
    RequestItemIdChanged(state, action) {
      state.itemId = action.payload;
    },
    RequestListIdChange(state, action) {
      state.listId = action.payload;
    },
    RequestTermialIdChange(state, action) {
      state.terminalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestListIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchRequestListIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.listId = action.payload as string;
      })
      .addCase(fetchRequestListIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(fetchByIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchByIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.item = action.payload as IRequestListItem;
      })
      .addCase(fetchByIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(fetchByTermialIdAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(fetchByTermialIdAction.fulfilled, (state, action) => {
        state.statue = RequestStatus.Idle;
        state.items = [...(action.payload as readonly IRequestListItem[])];
      })
      .addCase(fetchByTermialIdAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(addRequestAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(addRequestAction.fulfilled, (state, action) => {
        const { request } = action.meta.arg;
        state.statue = RequestStatus.Idle;
        state.item = request;
      })
      .addCase(addRequestAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      })
      .addCase(editRequestAction.pending, (state, action) => {
        state.statue = RequestStatus.Loading;
      })
      .addCase(editRequestAction.fulfilled, (state, action) => {
        //const { request } = action.meta.arg;
        state.statue = RequestStatus.Idle;
        //state.item = {...state.item,...request};
        state.item = action.payload as IRequestListItem;
      })
      .addCase(editRequestAction.rejected, (state, action) => {
        state.statue = RequestStatus.Failed;
        state.message = action.payload as string;
      });
  },
});

export const { RequestStatusChanged, RequestItemChanged, RequestItemIdChanged, RequestListIdChange, RequestTermialIdChange } =
  requestsSlice.actions;
export const requestsReducer = requestsSlice.reducer;
