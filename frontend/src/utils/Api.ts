import originalAxios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export type ApiData<GetResponseSuccessBody> = "Not Asked" | "Loading" | AxiosError | GetResponseSuccessBody;

export const isResponseSuccessBody = <T>(apiData: ApiData<T>): apiData is T =>
    typeof apiData !== "string" && !isResponseError(apiData);

export const isResponseError = <T>(apiData: ApiData<T>): apiData is AxiosError =>
    typeof apiData !== "string" && "config" in apiData;

export const axios = originalAxios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});

axios.interceptors.response.use(undefined, error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 500) {
            toast.error("Tut mir leid, es ist ein Fehler aufgetreten. Bitte versuchs später nochmal.");
        }
    } else {
        toast.error("Kann nicht mit dem Server verbinden, überprüf deine Netzverbindung und versuchs später nochmal.");
    }

    return Promise.reject(error);
});
