import { Helmet } from "react-helmet";
import styled from "styled-components";
import React from "react";

interface PageProps {
    error?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    public?: boolean;
    title: string;
}

export const Page = (props: PageProps) => {
    return (
        <PageContainer>
            <Helmet title={props.title} />

            {props.children}
        </PageContainer>
    );
};

const PageContainer = styled.main`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
