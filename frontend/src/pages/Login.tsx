import { connect } from "react-redux";
import React, { useEffect } from "react";
import { Field, FieldProps, Formik } from "formik";
import { Heading, Form, TextInput, Text, Button, Box, Anchor, FormField } from "grommet";
import * as yup from "yup";

import { Page } from "../components/Page";
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

type LoginPageValues = {
    username: string;
    password: string;
    isRegistering: boolean;
};

const UnenhancedLoginPage = (props: LoginPageProps) => {
    useEffect(() => {
        if (props.isLoggedIn) {
            props.history.push("/home");
        }
    });

    return (
        <Formik
            initialValues={{ username: "", password: "", isRegistering: true } as LoginPageValues}
            onSubmit={values => {
                const submitFunc = values.isRegistering ? props.register : props.login;
                submitFunc(values.username, values.password);
            }}
            validationSchema={yup.object().shape({
                username: yup.string().required("Bitte Benutzername eingeben"),
                password: yup
                    .string()
                    .required("Bitte Password eingeben")
                    .min(5, "Bitte mindestens 5 Zeichen eingeben"),
            })}
            validateOnBlur={true}
            validateOnChange={true}
            render={({ errors, handleSubmit, setFieldValue, touched, values }) => {
                const title = values.isRegistering ? "Registrieren" : "Einloggen";

                return (
                    <Page isBlockedLoading={props.isLoading} public={true} title={title}>
                        <Heading level="1">Tic-Tac-Toe</Heading>

                        <Form onSubmit={handleSubmit}>
                            <Box align="center" gap="small" margin={{ bottom: "24px" }} width="220px">
                                <Field
                                    name="username"
                                    render={({ field }: FieldProps) => (
                                        <FormField error={touched.username && errors.username}>
                                            <TextInput placeholder="Benutzername" {...field} />
                                        </FormField>
                                    )}
                                />

                                <Field
                                    name="password"
                                    render={({ field }: FieldProps) => (
                                        <FormField error={touched.password && errors.password}>
                                            <TextInput {...field} placeholder="Passwort" type="password" />
                                        </FormField>
                                    )}
                                />

                                <Button label={title} primary type="submit" />
                            </Box>
                        </Form>

                        <Text>
                            {values.isRegistering ? (
                                <>
                                    Du hast schon einen Account?{" "}
                                    <Anchor
                                        label="Log dich ein."
                                        onClick={() => setFieldValue("isRegistering", false)}
                                    />
                                </>
                            ) : (
                                <>
                                    Du hast noch keinen Account?{" "}
                                    <Anchor
                                        label="Registrier dich."
                                        onClick={() => setFieldValue("isRegistering", true)}
                                    />
                                </>
                            )}
                        </Text>
                    </Page>
                );
            }}
        />
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
