import { Helmet } from "react-helmet";
import React from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { connect } from "react-redux";
import { Heading } from "grommet";

import { RootState } from "../stores/rootStore/RootTypes";
import { getIsLoggedIn } from "../stores/environmentStore/EnvironmentSelectors";

interface PageReduxProps {
    isLoggedIn: boolean | undefined;
}

interface PageOwnProps {
    error?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    public?: boolean;
    title: string;
}

type PageProps = PageReduxProps & PageOwnProps & RouteComponentProps;

const UnenhancedPage = (props: PageProps) => {
    if (!props.public && props.isLoggedIn === false) {
        props.history.push("/login");
        return null;
    }

    if (props.isLoading) {
        return (
            <BarLoaderContainer>
                <Heading level="2">Laden...</Heading>
                <BarLoader color="#00739d" height={11} loading={props.isLoading || false} width={200} />
            </BarLoaderContainer>
        );
    }

    return (
        <PageContainer>
            <Helmet title={props.title} />

            {props.children}
        </PageContainer>
    );
};

const PageContainer = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
`;

const BarLoaderContainer = styled.div`
    align-items: center;
    background: #fff;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
`;

export const Page = withRouter<PageOwnProps & RouteComponentProps>(
    connect((rootState: RootState) => ({
        isLoggedIn: getIsLoggedIn(rootState.environment.environment),
    }))(UnenhancedPage)
);
