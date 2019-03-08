import { ApiData } from "frontend/src/utils/Api";
import { UserEnvironmentGetResponseBody } from "common/types/api/user/environment/get/ResponseBody";

type Environment = ApiData<UserEnvironmentGetResponseBody>;

export interface EnvironmentState {
    environment: Environment;
}
