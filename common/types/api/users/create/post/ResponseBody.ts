import { UsersEnvironmentGetResponseBody } from "../../environment/get/ResponseBody";

export type UsersCreatePostResponseBody = UsersEnvironmentGetResponseBody;

export enum UsersCreatePostErrorMessage {
    AlreadyExistingUser = "AlreadyExistingUser",
}
