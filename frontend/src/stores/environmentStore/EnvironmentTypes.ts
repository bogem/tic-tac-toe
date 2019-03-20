import { ActionType } from "typesafe-actions";

import { ApiData } from "../../utils/Api";
import { UsersEnvironmentGetResponseBody } from "../../../../common/types/api/users/environment/get/ResponseBody";
import * as actions from "./EnvironmentActions";

export type Environment = ApiData<UsersEnvironmentGetResponseBody> | "Not Logged In";

export type EnvironmentAction = ActionType<typeof actions>;

export interface EnvironmentState {
    environment: Environment;
}
