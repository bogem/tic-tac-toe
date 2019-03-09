import React, { useState } from "react";
import { Heading, Form, TextInput, Button } from "grommet";
import { Page } from "../components/Page";
import { handleTextInput } from "../utils/Handlers";

interface LoginPageReduxProps {
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
}

type LoginPageProps = LoginPageReduxProps;

const UnenhancedLoginPage = (props: LoginPageProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = () => {
        console.log(username, password);
    };

    return (
        <Page title="Einloggen">
            <Heading level="1">Tic-Tac-Toe</Heading>

            <Heading level="2">Einloggen</Heading>

            <Form onSubmit={handleSubmit}>
                <TextInput onChange={handleTextInput(setUsername)} placeholder="Benutzername" value={username} />
                <TextInput onChange={handleTextInput(setPassword)} placeholder="Passwort" value={password} />
            </Form>

            <Button type="submit" />
        </Page>
    );
};

export const LoginPage = UnenhancedLoginPage;
