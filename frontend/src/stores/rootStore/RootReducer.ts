import { combineReducers } from "redux";

import { environmentReducer } from "../environmentStore/EnvironmentReducer";

export const rootReducer = combineReducers({
    environment: environmentReducer,
});
