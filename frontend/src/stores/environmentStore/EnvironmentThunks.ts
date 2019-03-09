import { AxiosResponse, AxiosError } from "axios";

import { RootDispatch } from "../rootStore/RootTypes";
import { UsersEnvironmentGetResponseBody } from "common/types/api/users/environment/get/ResponseBody";
import { UsersCreatePostResponseBody } from "common/types/api/users/create/post/ResponseBody";
import { axios } from "../../utils/Api";
import { environmentSetEnvironment } from "./EnvironmentActions";
import { toast } from "react-toastify";

export const environmentGetEnvironment = () => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    axios
        .get("/api/user/environment")
        .then((response: AxiosResponse<UsersEnvironmentGetResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                dispatch(environmentSetEnvironment("Not Logged In"));
            }
        });
};

export const environmentRegister = (username: string, password: string) => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    return axios
        .post("/api/user/new", { username, password })
        .then((response: AxiosResponse<UsersCreatePostResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));
        })
        .catch((error: AxiosError) => {
            dispatch(environmentSetEnvironment("Not Asked"));

            if (error.response && error.response.status === 400) {
                if (error.response.data === "USER_EXISTS_ALREADY") {
                    toast.error("Dieser Benutzer existiert schon.");
                }
            }
        });
};
