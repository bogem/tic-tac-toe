import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";

import { rootReducer } from "./RootReducer";

// @ts-ignore
const devToolsCompose = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers =
    (process.env.NODE_ENV !== "production" && devToolsCompose && devToolsCompose({ trace: true })) || compose;

export const rootStore = createStore(rootReducer, undefined, composeEnhancers(applyMiddleware(thunk)));
