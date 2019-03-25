import React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";

import { RootState } from "../stores/rootStore/RootTypes";
import { getIsLoggedIn } from "../stores/environmentStore/EnvironmentSelectors";
import { Page } from "../components/Page";
import { PagePathname } from "../../../common/Urls";

interface RootPageReduxProps {
    isLoggedIn: boolean | undefined;
}

type RootPageProps = RootPageReduxProps & RouteComponentProps;

const UnenhancedRootPage = ({ isLoggedIn, history }: RootPageProps) => {
    if (isLoggedIn) {
        history.push(PagePathname.Home);
    } else if (isLoggedIn === false) {
        history.push(PagePathname.Login);
    }

    return (
        <Page isLoading={isLoggedIn === undefined} title="Laden...">
            {null}
        </Page>
    );
};

export const RootPage = connect((rootState: RootState) => ({
    isLoggedIn: getIsLoggedIn(rootState.environment.me),
}))(UnenhancedRootPage);
