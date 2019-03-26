import originalAxios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { ApiServerUrl } from "../../../common/Urls";

export type ApiData<GetResponseSuccessBody> =
    | "Not Asked"
    | "Loading"
    | AxiosError
    | GetResponseSuccessBody;

export const isResponseSuccessBody = <T>(data: ApiData<T>): data is T =>
    typeof data !== "string" && !isResponseError(data);

export const isResponseError = <T>(data: ApiData<T>): data is AxiosError =>
    typeof data !== "string" && "config" in data;

export const axios = originalAxios.create({
    baseURL: ApiServerUrl,
    withCredentials: true,
});

axios.interceptors.response.use(undefined, (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 500) {
            toast.error(
                "Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuchs später nochmal."
            );
        }
    } else {
        toast.error(
            "Kann nicht mit dem Server verbinden," +
                " überprüf deine Netzverbindung und versuchs später nochmal."
        );
    }

    return Promise.reject(error);
});
