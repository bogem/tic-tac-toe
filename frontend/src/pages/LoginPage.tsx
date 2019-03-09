import { connect } from "react-redux";
import React, { useState } from "react";
import { Heading, Form, TextInput, Text, Button, Box, Anchor } from "grommet";

import { Page } from "../components/Page";
import { handleTextInput } from "../utils/Handlers";
import { environmentRegister, environmentLogin } from "../stores/environmentStore/EnvironmentThunks";
import { RootDispatch, RootState } from "../stores/rootStore/RootTypes";

interface LoginPageReduxProps {
    isLoading: boolean;
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
}

type LoginPageProps = LoginPageReduxProps;

const UnenhancedLoginPage = (props: LoginPageProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = () => {
        if (isRegistering) {
            props.register(username, password);
        } else {
            props.login(username, password);
        }
    };

    const title = isRegistering ? "Registrieren" : "Einloggen";

    return (
        <Page isLoading={props.isLoading} title={title}>
            <Heading level="1">Tic-Tac-Toe</Heading>

            <Heading level="2">{title}</Heading>

            <Form onSubmit={handleSubmit}>
                <Box align="center" gap="small" margin={{ bottom: "24px" }}>
                    <TextInput onChange={handleTextInput(setUsername)} placeholder="Benutzername" value={username} />

                    <TextInput
                        onChange={handleTextInput(setPassword)}
                        placeholder="Passwort"
                        type="password"
                        value={password}
                    />

                    <Button label="Go" primary type="submit" />
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
    (rootState: RootState) => ({
        isLoading: rootState.environment.environment === "Loading",
    }),
    (dispatch: RootDispatch) => ({
        login: (username: string, password: string) => {
            dispatch(environmentLogin(username, password));
        },
        register: (username: string, password: string) => {
            dispatch(environmentRegister(username, password));
        },
    })
)(UnenhancedLoginPage);
