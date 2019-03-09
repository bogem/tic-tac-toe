import React from "react";
import { Heading, RoutedAnchor, Box } from "grommet";

import { Page } from "../components/Page";

export const HomePage = () => (
    <Page title="Home">
        <Heading level="1">Tic-Tac-Toe</Heading>

        <Box margin={{ bottom: "16px" }}>
            <RoutedAnchor path="/games/join">Spiel beitreten</RoutedAnchor>
        </Box>

        <RoutedAnchor path="/games/create">Spiel erstellen</RoutedAnchor>
    </Page>
);
