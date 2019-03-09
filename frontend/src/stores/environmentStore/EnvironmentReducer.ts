import { getType } from "typesafe-actions";

import * as actions from "./EnvironmentActions";
import { EnvironmentState, EnvironmentAction } from "./EnvironmentTypes";
import { initialEnvironmentState } from "./EnvironmentStore";

export const environmentReducer = (
    state: EnvironmentState = initialEnvironmentState,
    action: EnvironmentAction
): EnvironmentState => {
    switch (action.type) {
        case getType(actions.environmentSetEnvironment):
            return { environment: action.payload };
    }

    return state;
};
