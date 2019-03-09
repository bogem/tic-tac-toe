import { ThunkDispatch } from "redux-thunk";

import { EnvironmentAction, EnvironmentState } from "../environmentStore/EnvironmentTypes";

export type RootDispatch = ThunkDispatch<RootState, undefined, RootAction>;

export type RootAction = EnvironmentAction;

export interface RootState {
    environment: EnvironmentState;
}
