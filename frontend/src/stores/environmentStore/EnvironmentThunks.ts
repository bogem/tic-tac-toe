import { AxiosResponse, AxiosError } from "axios";

import { RootDispatch } from "../rootStore/RootTypes";
import { UsersEnvironmentGetResponseBody } from "common/types/api/users/environment/get/ResponseBody";
import { UsersCreatePostRequestBody } from "common/types/api/users/create/post/RequestBody";
import {
    UsersCreatePostResponseBody,
    UsersCreatePostErrorMessages,
} from "common/types/api/users/create/post/ResponseBody";
import {
    UsersLoginPostResponseBody,
    UsersLoginPostErrorMessages,
} from "common/types/api/users/login/post/ResponseBody";
import { UsersLoginPostRequestBody } from "common/types/api/users/login/post/RequestBody";
import { axios } from "../../utils/Api";
import { environmentSetEnvironment } from "./EnvironmentActions";
import { toast } from "react-toastify";

export const environmentGetEnvironment = () => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    axios
        .get("/api/users/environment")
        .then((response: AxiosResponse<UsersEnvironmentGetResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                dispatch(environmentSetEnvironment("Not Logged In"));
            }
        });
};

export const environmentLogin = (username: string, password: string) => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    return axios
        .post("/api/users/login", { username, password } as UsersLoginPostRequestBody)
        .then((response: AxiosResponse<UsersLoginPostResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));

            toast.success("Du bist erfolgreich eingeloggt");

            return response;
        })
        .catch((error: AxiosError) => {
            dispatch(environmentSetEnvironment("Not Asked"));

            if (error.response) {
                const { status, data } = error.response;

                if (status === 404 && data === UsersLoginPostErrorMessages.NONEXISTENT_USER) {
                    toast.error("Dieser Benutzer existiert nicht");
                } else if (status === 400 && data === UsersLoginPostErrorMessages.INCORRECT_PASSWORD) {
                    toast.error("Passwort stimmt nicht");
                }
            }

            throw error;
        });
};

export const environmentRegister = (username: string, password: string) => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    return axios
        .post("/api/users/create", { username, password } as UsersCreatePostRequestBody)
        .then((response: AxiosResponse<UsersCreatePostResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));

            toast.success("Du bist erfolgreich registriert");

            return response;
        })
        .catch((error: AxiosError) => {
            dispatch(environmentSetEnvironment("Not Asked"));

            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data === UsersCreatePostErrorMessages.ALREADY_EXISTING_USER
            ) {
                toast.error("Dieser Benutzer existiert schon");
            }

            throw error;
        });
};
