import { UsersEnvironmentGetResponseBody } from "../../environment/get/ResponseBody";

export type UsersLoginPostResponseBody = UsersEnvironmentGetResponseBody;

export enum UsersLoginPostErrorMessage {
    NonexistentUser = "NonexistentUser",
    IncorrectPassword = "IncorrectPassword",
}
