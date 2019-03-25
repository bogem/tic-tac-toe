import { createStandardAction } from "typesafe-actions";

import { Me } from "./EnvironmentTypes";

export const environmentSetMe = createStandardAction("ENVIRONMENT/SET_ME")<Me>();
