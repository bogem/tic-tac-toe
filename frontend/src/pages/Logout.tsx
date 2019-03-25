import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { Page } from "../components/Page";
import { axios } from "../utils/Api";
import { RootDispatch } from "../stores/rootStore/RootTypes";
import { environmentSetMe } from "../stores/environmentStore/EnvironmentActions";
import { ApiPathname, PagePathname } from "../../../common/Urls";

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
            axios.post(ApiPathname.UsersLogout).then(() => {
                dispatch(environmentSetMe("Not Logged In"));
                ownProps.history.push(PagePathname.Login);
            });
        },
    })
)(UnenhancedLogoutPage);
