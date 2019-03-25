import { Me } from "./EnvironmentTypes";
import { isResponseSuccessBody } from "../../utils/Api";

export const getIsLoggedIn = (environment: Me) =>
    environment === "Not Logged In" ? false : isResponseSuccessBody(environment) || undefined;
