import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { Page } from "../components/Page";
import { axios } from "../utils/Api";
import { RootDispatch } from "../stores/rootStore/RootTypes";
import { environmentSetEnvironment } from "../stores/environmentStore/EnvironmentActions";

interface LogoutPageReduxProps {
    logout: () => void;
}

type LogoutPageProps = LogoutPageReduxProps & RouteComponentProps;

const UnenhancedLogoutPage = (props: LogoutPageProps) => {
    props.logout();

    return (
        <Page isLoading={true} title="Logout">
            {null}
        </Page>
    );
};

export const LogoutPage = connect(
    null,
    (dispatch: RootDispatch, ownProps: RouteComponentProps) => ({
        logout() {
            axios.post("/api/users/logout").then(() => {
                dispatch(environmentSetEnvironment("Not Logged In"));
                ownProps.history.push("/login");
            });
        },
    })
)(UnenhancedLogoutPage);
