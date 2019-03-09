import { UsersEnvironmentGetResponseBody } from "../../environment/get/ResponseBody";

export type UsersLoginPostResponseBody = UsersEnvironmentGetResponseBody;

export enum UsersLoginPostErrorMessages {
    NONEXISTENT_USER = "NONEXISTENT_USER",
    INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
}
