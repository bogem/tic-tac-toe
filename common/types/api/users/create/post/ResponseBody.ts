import { UsersEnvironmentGetResponseBody } from "../../environment/get/ResponseBody";

export type UsersCreatePostResponseBody = UsersEnvironmentGetResponseBody;

export enum UsersCreatePostErrorMessages {
    ALREADY_EXISTING_USER = "ALREADY_EXISTING_USER",
}
