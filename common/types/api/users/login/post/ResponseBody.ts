import { UsersMeGetResponseBody } from "../../me/get/ResponseBody";

export type UsersLoginPostResponseBody = UsersMeGetResponseBody;

export enum UsersLoginPostErrorMessage {
    NonexistentUser = "NonexistentUser",
    IncorrectPassword = "IncorrectPassword",
}
