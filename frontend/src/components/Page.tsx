import { Helmet } from "react-helmet";
import React from "react";
import styled from "styled-components";
import { BarLoader } from "react-spinners";

interface PageProps {
    error?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    public?: boolean;
    title: string;
}

export const Page = (props: PageProps) => (
    <PageContainer>
        <Helmet title={props.title} />

        {props.children}

        <LoadingSpinnerContainer>
            <BarLoader color="#00739d" height={5} loading={props.isLoading || false} width={70} />
        </LoadingSpinnerContainer>
    </PageContainer>
);

const LoadingSpinnerContainer = styled.div`
    bottom: 32px;
    position: fixed;
    right: 40px;
`;

const PageContainer = styled.main`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
`;
