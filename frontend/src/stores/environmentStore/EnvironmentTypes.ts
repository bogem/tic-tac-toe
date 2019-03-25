import { ActionType } from "typesafe-actions";

import { ApiData } from "../../utils/Api";
import { UsersMeGetResponseBody } from "../../../../common/types/api/users/me/get/ResponseBody";
import * as actions from "./EnvironmentActions";

export type Me = ApiData<UsersMeGetResponseBody> | "Not Logged In";

export type EnvironmentAction = ActionType<typeof actions>;

export interface EnvironmentState {
    me: Me;
}
