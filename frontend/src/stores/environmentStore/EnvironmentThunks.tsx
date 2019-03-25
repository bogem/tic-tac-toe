import React from "react";
import { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";

import { RootDispatch } from "../rootStore/RootTypes";
import { UsersMeGetResponseBody } from "../../../../common/types/api/users/me/get/ResponseBody";
import { UsersCreatePostRequestBody } from "../../../../common/types/api/users/create/post/RequestBody";
import {
    UsersCreatePostResponseBody,
    UsersCreatePostErrorMessage,
} from "../../../../common/types/api/users/create/post/ResponseBody";
import {
    UsersLoginPostResponseBody,
    UsersLoginPostErrorMessage,
} from "../../../../common/types/api/users/login/post/ResponseBody";
import { UsersLoginPostRequestBody } from "../../../../common/types/api/users/login/post/RequestBody";
import { axios } from "../../utils/Api";
import { environmentSetMe } from "./EnvironmentActions";
import { ApiPathname } from "../../../../common/Urls";

export const environmentGetEnvironment = () => (dispatch: RootDispatch) => {
    dispatch(environmentSetMe("Loading"));

    axios
        .get(ApiPathname.UsersMe)
        .then((response: AxiosResponse<UsersMeGetResponseBody>) => {
            dispatch(environmentSetMe(response.data));
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                dispatch(environmentSetMe("Not Logged In"));
            }
        });
};

export const environmentLogin = (username: string, password: string) => (dispatch: RootDispatch) => {
    dispatch(environmentSetMe("Loading"));

    return axios
        .post(ApiPathname.UsersLogin, { username, password } as UsersLoginPostRequestBody)
        .then((response: AxiosResponse<UsersLoginPostResponseBody>) => {
            dispatch(environmentSetMe(response.data));

            toast(
                <span>
                    Hi <b>${username}</b>, du bist erfolgreich eingeloggt
                </span>
            );

            return response;
        })
        .catch((error: AxiosError) => {
            dispatch(environmentSetMe("Not Asked"));

            if (error.response) {
                const { status, data } = error.response;

                if (status === 404 && data === UsersLoginPostErrorMessage.NonexistentUser) {
                    toast.error("Dieser Benutzer existiert nicht");
                } else if (status === 400 && data === UsersLoginPostErrorMessage.IncorrectPassword) {
                    toast.error("Passwort stimmt nicht");
                }
            }

            throw error;
        });
};

export const environmentRegister = (username: string, password: string) => (dispatch: RootDispatch) => {
    dispatch(environmentSetMe("Loading"));

    return axios
        .post(ApiPathname.UsersCreate, { username, password } as UsersCreatePostRequestBody)
        .then((response: AxiosResponse<UsersCreatePostResponseBody>) => {
            dispatch(environmentSetMe(response.data));

            toast(
                <span>
                    Hi <b>${username}</b>, du bist erfolgreich registriert
                </span>
            );

            return response;
        })
        .catch((error: AxiosError) => {
            dispatch(environmentSetMe("Not Asked"));

            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data === UsersCreatePostErrorMessage.AlreadyExistingUser
            ) {
                toast.error("Dieser Benutzer existiert schon");
            }

            throw error;
        });
};
