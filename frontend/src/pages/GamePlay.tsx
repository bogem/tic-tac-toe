import { AxiosPromise } from "axios";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Text } from "grommet";
import styled from "styled-components";
import { connect } from "react-redux";
import socketIo from "socket.io-client";

import { Page } from "../components/Page";
import { GamesInfoGetResponseBody } from "../../../common/types/api/games/info/get/ResponseBody";
import { axios, isResponseSuccessBody } from "../utils/Api";
import { GameEventName, Game } from "../../../common/types/Game";
import { GameBoard as GameBoardType } from "../../../common/types/GameBoard";
import { RootState } from "../stores/rootStore/RootTypes";
import { CurrentGameStateEventData, GamePlayEventName } from "../../../common/types/sockets/GamesPlay";
import { GamesMakeMoveRequestBody } from "../../../common/types/api/games/make_move/RequestBody";

interface GamePlayPageReduxProps {
    username: string | undefined;
}

type GamePlayPageProps = GamePlayPageReduxProps & RouteComponentProps<{ gameId: string }>;

const UnenhancedGamePlayPage = ({ match, username }: GamePlayPageProps) => {
    const [gameInfo, setGameInfo] = useState<Game | undefined>(undefined);
    const [gameBoard, setGameBoard] = useState<GameBoardType | undefined>(undefined);

    const { gameId } = match.params;
    let socket: SocketIOClient.Socket | undefined;

    useEffect(() => {
        if (!username) {
            return;
        }

        const fetchGameInfo = (): AxiosPromise<GamesInfoGetResponseBody> => axios.get(`/api/games/${gameId}/info`);
        const joinGame = () => axios.post(`/api/games/${gameId}/join`);
        const listenToGameSocket = () => {
            socket = socketIo("http://localhost:3002/games/play");
            socket.emit(GamePlayEventName.GameRoomConnect, { gameId, username });

            socket.on(GamePlayEventName.CurrentGameState, (data: CurrentGameStateEventData) => {
                setGameInfo(data.game);
                setGameBoard(data.gameBoard);
            });
            socket.on(GamePlayEventName.GameMove, (data: any) => console.log(data));
        };

        fetchGameInfo().then(response => {
            const game = response.data;

            setGameInfo(game);

            if (game.hostUsername !== username && !game.guestUsername) {
                // If current user is not the host and there is no guest in the game,
                // then join it.
                joinGame().then(listenToGameSocket);
            } else if (game.hostUsername !== username && game.guestUsername && game.guestUsername !== username) {
                // Show error that there is a player already
                alert("You can't join");
            } else if (game.hostUsername === username || game.guestUsername === username) {
                // If user is alreay a participant of game,
                // then just fetch game board.
                listenToGameSocket();
            }
        });

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [gameId, username]);

    const makeMove = (row: number, column: number) => {
        if (!gameBoard || gameBoard[row][column] !== "") {
            return;
        }

        const newGameBoardRow = gameBoard[row].slice();
        newGameBoardRow[column] = username!;

        const newGameBoard = gameBoard.slice();
        newGameBoard[row] = newGameBoardRow;

        setGameBoard(newGameBoard);
        axios.post(`/api/games/${gameId}/make_move`, { coords: { row, column } } as GamesMakeMoveRequestBody);
    };

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
            {gameBoard && gameInfo && gameInfo.guestUsername && (
                <GameBoard
                    gameBoard={gameBoard}
                    guestUsername={gameInfo.guestUsername}
                    disabled={!isGameBoardEnabled}
                    hostUsername={gameInfo.hostUsername}
                    onCellClick={makeMove}
                />
            )}
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
    guestUsername: string;
    hostUsername: string;
    onCellClick: (row: number, column: number) => void;
}

/* TODO: after TS 3.4 release use "as const" in GameBoardCell children. */
const GameBoard = (props: GameBoardProps) => (
    <table>
        <tbody>
            {props.gameBoard.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((column, columnIndex) => (
                        <GameBoardCell
                            disabled={props.disabled}
                            key={columnIndex}
                            onClick={() => props.onCellClick(rowIndex, columnIndex)}
                        >
                            {column === props.hostUsername
                                ? ("X" as "X")
                                : column === props.guestUsername
                                ? ("O" as "O")
                                : ("" as "")}
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
    onClick: () => void;
}

const GameBoardCell = styled.td<GameBoardCellProps>`
    border: 1px solid ${props => (props.disabled ? "#dadada" : "#4f4f4f")};
    cursor: ${props => (props.disabled || props.children !== "" ? "not-allowed" : "pointer")};
    text-align: center;
    height: 50px;
    width: 50px;
`;
