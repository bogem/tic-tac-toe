import React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";

import { RootState } from "../stores/rootStore/RootTypes";
import { getIsLoggedIn } from "../stores/environmentStore/EnvironmentSelectors";
import { Page } from "../components/Page";

interface RootPageReduxProps {
    isLoggedIn: boolean | undefined;
}

type RootPageProps = RootPageReduxProps & RouteComponentProps;

const UnenhancedRootPage = ({ isLoggedIn, history }: RootPageProps) => {
    if (isLoggedIn) {
        history.push("/home");
    } else if (isLoggedIn === false) {
        history.push("/login");
    }

    return (
        <Page isBlockedLoading={isLoggedIn === undefined} title="Laden...">
            null
        </Page>
    );
};

export const RootPage = connect((rootState: RootState) => ({
    isLoggedIn: getIsLoggedIn(rootState.environment.environment),
}))(UnenhancedRootPage);
