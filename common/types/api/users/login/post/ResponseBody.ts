import { UsersEnvironmentGetResponseBody } from "../../environment/get/ResponseBody";

export type UsersLoginPostResponseBody = UsersEnvironmentGetResponseBody;

export enum UsersLoginPostErrorMessages {
    NonexistentUser = "NonexistentUser",
    IncorrectPassword = "IncorrectPassword",
}
