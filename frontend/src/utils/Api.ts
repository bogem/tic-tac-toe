import { AxiosError } from "axios";

export type ApiData<GetResponseSuccessBody> = "Loading" | AxiosError | GetResponseSuccessBody;

export const isResponseSuccessBody = <T>(apiData: ApiData<T>): apiData is T =>
    apiData !== "Loading" && !isResponseError(apiData);

export const isResponseError = <T>(apiData: ApiData<T>): apiData is AxiosError =>
    apiData !== "Loading" && "config" in apiData;
