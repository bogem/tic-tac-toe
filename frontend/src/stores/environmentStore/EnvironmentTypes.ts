import { ActionType } from "typesafe-actions";

import { ApiData } from "frontend/src/utils/Api";
import { UserEnvironmentGetResponseBody } from "common/types/api/user/environment/get/ResponseBody";
import * as actions from "./EnvironmentActions";

export type Environment = ApiData<UserEnvironmentGetResponseBody> | "Not Logged In";

export type EnvironmentAction = ActionType<typeof actions>;

export interface EnvironmentState {
    environment: Environment;
}
