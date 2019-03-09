import { createStandardAction } from "typesafe-actions";

import { Environment } from "./EnvironmentTypes";

export const environmentSetEnvironment = createStandardAction("ENVIRONMENT/SET_ENVIRONMENT")<Environment>();
