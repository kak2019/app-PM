import { configureStore } from "@reduxjs/toolkit";
import { entitiesReducer } from "./features/entities";
import { requestsReducer } from "./features/requests";

const store = configureStore({
    reducer: {
        entities: entitiesReducer,
        requests: requestsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
