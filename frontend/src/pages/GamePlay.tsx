import { AxiosPromise } from "axios";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Text } from "grommet";
import styled, { css } from "styled-components";

import { Page } from "../components/Page";
import { GamesInfoGetResponseBody } from "../../../common/types/api/games/info/get/ResponseBody";
import { GamesBoardGetResponseBody } from "../../../common/types/api/games/board/get/ResponseBody";
import { axios, isResponseSuccessBody } from "../utils/Api";
import { GameEventName, Game } from "../../../common/types/Game";
import { GameBoard as GameBoardType } from "../../../common/types/GameBoard";
import { RootState } from "../stores/rootStore/RootTypes";
import { connect } from "react-redux";

interface GamePlayPageReduxProps {
    username: string | undefined;
}

type GamePlayPageProps = GamePlayPageReduxProps & RouteComponentProps<{ gameId: string }>;

const UnenhancedGamePlayPage = ({ match, username }: GamePlayPageProps) => {
    const [gameInfo, setGameInfo] = useState<Game | undefined>(undefined);
    const [gameBoard, setGameBoard] = useState<GameBoardType | undefined>(undefined);

    const { gameId } = match.params;

    useEffect(() => {
        if (!username) {
            return;
        }

        const fetchGameInfo = (): AxiosPromise<GamesInfoGetResponseBody> => axios.get(`/api/games/${gameId}/info`);
        const joinGame = () => axios.post(`/api/games/${gameId}/join`);
        const fetchGameBoard = () =>
            axios
                .get<GamesBoardGetResponseBody>(`/api/games/${gameId}/board`)
                .then(response => setGameBoard(response.data));

        fetchGameInfo().then(response => {
            const game = response.data;

            setGameInfo(game);

            if (game.hostUsername !== username && !game.guestUsername) {
                // If current user is not the host and there is no guest in the game,
                // then join it.
                joinGame().then(fetchGameBoard);
            } else if (game.hostUsername !== username && game.guestUsername && game.guestUsername !== username) {
                // Show error that there is a player already
                alert("You can't join");
            } else if (game.hostUsername === username || game.guestUsername === username) {
                // If user is alreay a participant of game,
                // then just fetch game board.
                fetchGameBoard();
            }
        });
    }, [gameId, username]);

    const isGameBoardEnabled =
        gameInfo &&
        ((gameInfo.lastEvent.name === GameEventName.OpponentJoin && gameInfo.hostUsername === username) ||
            (gameInfo.lastEvent.name === GameEventName.GamerMove && gameInfo.lastEvent.meta.username !== username));

    return (
        <Page isLoading={username === undefined} title="Spielen">
            {gameInfo && (
                <Text margin={{ bottom: "24px" }}>
                    <b>Aktuelle Stand:</b> {gameInfo.lastEvent.name}
                </Text>
            )}
            {gameBoard && <GameBoard gameBoard={gameBoard} disabled={!isGameBoardEnabled} username={username!} />}
        </Page>
    );
};

export const GamePlayPage = connect(({ environment }: RootState) => ({
    username:
        environment.environment !== "Not Logged In" && isResponseSuccessBody(environment.environment)
            ? environment.environment.username
            : undefined,
}))(UnenhancedGamePlayPage);

interface GameBoardProps {
    disabled?: boolean;
    gameBoard: GameBoardType;
    username: string;
}

/* TODO: after TS 3.4 release use "as const" in GameBoardCell children. */
const GameBoard = (props: GameBoardProps) => (
    <table>
        <tbody>
            {props.gameBoard.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((column, columnIndex) => (
                        <GameBoardCell disabled={props.disabled} key={columnIndex}>
                            {column === props.username ? ("X" as "X") : column === "N" ? ("" as "") : ("O" as "O")}
                        </GameBoardCell>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

interface GameBoardCellProps {
    children: "X" | "O" | "";
    disabled?: boolean;
}

const GameBoardCell = styled.td<GameBoardCellProps>`
    border: 1px solid #4f4f4f;
    cursor: pointer;
    height: 50px;
    width: 50px;

    ${props =>
        props.disabled &&
        css`
            border: 1px solid #dadada;
            cursor: not-allowed;
        `}
`;
