import { configureStore } from "@reduxjs/toolkit";
import { distributionsReducer } from "./features/distributions";
import { entitiesReducer } from "./features/entities";
import { requestsReducer } from "./features/requests";

const store = configureStore({
    reducer: {
        entities: entitiesReducer,
        requests: requestsReducer,
        distributions: distributionsReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
