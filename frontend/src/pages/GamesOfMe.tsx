import { AxiosResponse } from "axios";
import React, { useState, useEffect } from "react";
import { Text, RoutedAnchor } from "grommet";
import { connect } from "react-redux";

import { Game, gameStatus } from "../../../common/types/Game";
import { axios, isResponseSuccessBody } from "../utils/Api";
import { ApiPathname, gamesPlayPagePathname } from "../../../common/Urls";
import { GamesOfMeGetResponseBody } from "../../../common/types/api/games/of_me/get/ResponseBody";
import { Page } from "../components/Page";
import { RootState } from "../stores/rootStore/RootTypes";
import styled from "styled-components";

interface GamesOfMePageProps {
    username: string | undefined;
}

const UnenhancedGamesOfMePage = ({ username }: GamesOfMePageProps) => {
    const [games, setGames] = useState<Game[] | "Loading">("Loading");

    useEffect(() => {
        axios
            .get(ApiPathname.GamesOfMe)
            .then((response: AxiosResponse<GamesOfMeGetResponseBody>) => setGames(response.data));
    }, []);

    return (
        <Page
            isLoading={username === undefined}
            style={{ paddingTop: "90px" }}
            title="Deine Spiele"
        >
            {games === "Loading" ? (
                <Text>Laden ...</Text>
            ) : games.length === 0 ? (
                <Text>Du hast noch nicht gespielt</Text>
            ) : (
                games.map((game) => (
                    <GameList>
                        <li>
                            <b>Name:</b>{" "}
                            <RoutedAnchor path={gamesPlayPagePathname(game.id)}>
                                {game.name}
                            </RoutedAnchor>
                        </li>

                        <ul>
                            <li>{gameStatus(game, username!)}</li>
                            <li>
                                <b>Autor:</b> {game.hostUsername}
                            </li>
                            <li>
                                <b>Gast:</b> {game.guestUsername}
                            </li>
                            <li>
                                <b>Größe:</b> {game.size}x{game.size}
                            </li>
                        </ul>
                    </GameList>
                ))
            )}
        </Page>
    );
};

const GameList = styled.ul`
    margin-bottom: 16px;
    width: 260px;
`;

export const GamesOfMePage = connect(({ environment }: RootState) => ({
    username:
        isResponseSuccessBody(environment.me) && environment.me !== "Not Logged In"
            ? environment.me.username
            : undefined,
}))(UnenhancedGamesOfMePage);
