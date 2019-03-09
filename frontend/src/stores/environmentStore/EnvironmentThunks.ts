import { AxiosResponse } from "axios";

import { RootDispatch } from "../rootStore/RootTypes";
import { UserEnvironmentGetResponseBody } from "common/types/api/user/environment/get/ResponseBody";
import { UserNewPostResponseBody } from "common/types/api/user/new/post/ResponseBody";
import { axios } from "../../utils/Api";
import { environmentSetEnvironment } from "./EnvironmentActions";

export const environmentGetEnvironment = () => (dispatch: RootDispatch) => {
    dispatch(environmentSetEnvironment("Loading"));

    axios
        .get("/api/user/environment")
        .then((response: AxiosResponse<UserEnvironmentGetResponseBody>) => {
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
        .then((response: AxiosResponse<UserNewPostResponseBody>) => {
            dispatch(environmentSetEnvironment(response.data));
        });
};
