import { UsersMeGetResponseBody } from "../../me/get/ResponseBody";

export type UsersCreatePostResponseBody = UsersMeGetResponseBody;

export enum UsersCreatePostErrorMessage {
    AlreadyExistingUser = "AlreadyExistingUser",
}
