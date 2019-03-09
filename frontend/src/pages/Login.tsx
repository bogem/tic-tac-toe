import { connect } from "react-redux";
import React, { useState } from "react";
import { Heading, Form, TextInput, Text, Button, Box, Anchor, FormField } from "grommet";

import { Page } from "../components/Page";
import { handleTextInput } from "../utils/Handlers";
import { environmentRegister, environmentLogin } from "../stores/environmentStore/EnvironmentThunks";
import { RootDispatch, RootState } from "../stores/rootStore/RootTypes";
import { RouteComponentProps } from "react-router";
import { getIsLoggedIn } from "../stores/environmentStore/EnvironmentSelectors";

interface LoginPageReduxProps {
    isLoading: boolean;
    isLoggedIn: boolean | undefined;
    login: (username: string, password: string) => Promise<any>;
    register: (username: string, password: string) => Promise<any>;
}

type LoginPageProps = LoginPageReduxProps & RouteComponentProps;

const UnenhancedLoginPage = (props: LoginPageProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    React.useEffect(() => {
        if (props.isLoggedIn) {
            props.history.push("/home");
        }
    });

    const handleSubmit = () => {
        const submitFunc = isRegistering ? props.register : props.login;
        submitFunc(username, password);
    };

    const title = isRegistering ? "Registrieren" : "Einloggen";

    return (
        <Page isBlockedLoading={props.isLoading} title={title}>
            <Heading level="1">Tic-Tac-Toe</Heading>

            <Form onSubmit={handleSubmit}>
                <Box align="center" gap="small" margin={{ bottom: "24px" }}>
                    <FormField>
                        <TextInput
                            onChange={handleTextInput(setUsername)}
                            placeholder="Benutzername"
                            value={username}
                        />
                    </FormField>

                    <FormField>
                        <TextInput
                            onChange={handleTextInput(setPassword)}
                            placeholder="Passwort"
                            type="password"
                            value={password}
                        />
                    </FormField>

                    <Button label={title} primary type="submit" />
                </Box>
            </Form>

            <Text>
                {isRegistering ? (
                    <>
                        Du hast schon einen Account?{" "}
                        <Anchor label="Log dich ein." onClick={() => setIsRegistering(false)} />
                    </>
                ) : (
                    <>
                        Du hast noch keinen Account?{" "}
                        <Anchor label="Registrier dich." onClick={() => setIsRegistering(true)} />
                    </>
                )}
            </Text>
        </Page>
    );
};

export const LoginPage = connect(
    ({ environment }: RootState) => ({
        isLoading: environment.environment === "Loading",
        isLoggedIn: getIsLoggedIn(environment.environment),
    }),
    (dispatch: RootDispatch) => ({
        login: (username: string, password: string) => dispatch(environmentLogin(username, password)),
        register: (username: string, password: string) => dispatch(environmentRegister(username, password)),
    })
)(UnenhancedLoginPage);
