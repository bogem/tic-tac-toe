import React, { useEffect } from "react";
import styled from "styled-components";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { Heading } from "grommet";

import { BarLoader } from "./BarLoader";
import { RootState } from "../stores/rootStore/RootTypes";
import { getIsLoggedIn } from "../stores/environmentStore/EnvironmentSelectors";
import { NavBar } from "./NavBar";

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
    useEffect(() => {
        document.title = props.title;
    }, [props.title]);

    if (!props.public && props.isLoggedIn === false) {
        props.history.push("/login");
        return null;
    }

    let children;
    if (props.isLoading) {
        children = (
            <BarLoaderContainer>
                <Heading level="2">Laden...</Heading>
                <BarLoader height={11} loading={props.isLoading || false} width={200} />
            </BarLoaderContainer>
        );
    } else {
        children = props.children;
    }

    return (
        <PageContainer>
            <NavBar />
            <PageContent>{children}</PageContent>
        </PageContainer>
    );
};

const PageContainer = styled.main`
    flex-grow: 1;
    height: 100vh;
    width: 100%;
`;

const PageContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100vh;
    margin-top: -50px; /* height of navbar */
    justify-content: center;
    width: 100%;
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
        isLoggedIn: getIsLoggedIn(rootState.environment.me),
    }))(UnenhancedPage)
);
