import { Environment } from "./EnvironmentTypes";
import { isResponseSuccessBody } from "../../utils/Api";

export const getIsLoggedIn = (environment: Environment) =>
    environment === "Not Logged In" ? false : isResponseSuccessBody(environment) || undefined;
