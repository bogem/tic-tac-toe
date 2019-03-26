import { AxiosPromise } from "axios";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Text, RoutedAnchor, Box } from "grommet";
import styled from "styled-components";
import { connect } from "react-redux";
import socketIo from "socket.io-client";

import { Page } from "../components/Page";
import { GamesGetResponseBody } from "../../../common/types/api/games/get/ResponseBody";
import { axios, isResponseSuccessBody } from "../utils/Api";
import { GameEventName, Game, gameStatus, opponentUsername } from "../../../common/types/Game";
import { GameBoard as GameBoardType, GameBoardCoords } from "../../../common/types/GameBoard";
import { RootState } from "../stores/rootStore/RootTypes";
import {
    CurrentGameStateEventData,
    GameStateEventName,
} from "../../../common/types/sockets/GamesState";
import { GamesMakeMoveRequestBody } from "../../../common/types/api/games/make_move/RequestBody";
import {
    SocketServerUrl,
    SocketNamespacePathname,
    getGameApiPathname,
    gameJoinApiPathname,
    gameMakeMoveApiPathname,
    PagePathname,
} from "../../../common/Urls";
import { toast } from "react-toastify";

interface GamePlayPageReduxProps {
    username: string | undefined;
}

type GamePlayPageProps = GamePlayPageReduxProps & RouteComponentProps<{ gameId: string }>;

const UnenhancedGamePlayPage = ({ history, match, username }: GamePlayPageProps) => {
    const [game, setGame] = useState<Game | undefined>(undefined);
    const [gameBoard, setGameBoard] = useState<GameBoardType | undefined>(undefined);

    const { gameId } = match.params;
    let socket: SocketIOClient.Socket | undefined;

    useEffect(() => {
        if (!username) {
            return;
        }

        const fetchGame = (): AxiosPromise<GamesGetResponseBody> =>
            axios.get(getGameApiPathname(gameId));
        const joinGame = () => axios.post(gameJoinApiPathname(gameId));
        const listenToGameSocket = () => {
            socket = socketIo(SocketServerUrl + SocketNamespacePathname.GamesState);
            socket.emit(GameStateEventName.SubscribeToGameStateChanges, {
                gameId,
                username,
            });

            socket.on(GameStateEventName.CurrentGameState, (data: CurrentGameStateEventData) => {
                setGame(data.game);
                setGameBoard(data.gameBoard);
            });
        };

        fetchGame().then((response) => {
            const game = response.data;

            setGame(game);

            if (game.hostUsername !== username && !game.guestUsername) {
                // If current user is not the host
                // and there is no guest in the game,
                // then join it.
                joinGame().then(listenToGameSocket);
            } else if (
                game.hostUsername !== username &&
                game.guestUsername &&
                game.guestUsername !== username
            ) {
                // Show error that there is a player already
                toast.error("Du darfst in diesem Spiel nicht teilnehmen");
                history.push(PagePathname.Home + "#join-game");
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
        if (!gameBoard || gameBoard[row][column] !== null) {
            return;
        }

        const newGameBoardRow = gameBoard[row].slice();
        newGameBoardRow[column] = username!;

        const newGameBoard = gameBoard.slice();
        newGameBoard[row] = newGameBoardRow;

        setGameBoard(newGameBoard);
        axios.post(gameMakeMoveApiPathname(gameId), {
            coords: { row, column },
        } as GamesMakeMoveRequestBody);
    };

    const isGameBoardEnabled =
        game &&
        ((game.lastEvent.name === GameEventName.OpponentJoin && game.hostUsername === username) ||
            (game.lastEvent.name === GameEventName.GamerMove &&
                game.lastEvent.meta.username !== username));

    const isGameEnd =
        game &&
        (game.lastEvent.name === GameEventName.GameEndWithDraw ||
            game.lastEvent.name === GameEventName.GameEndWithWinner);

    const opponent = game && username && opponentUsername(game, username);

    return (
        <Page isLoading={username === undefined} title="Spielen">
            {game && (
                <>
                    <Box margin={{ bottom: "16px" }}>
                        <Text textAlign="center" weight="bold">
                            {game.name}
                        </Text>

                        {opponent && (
                            <Text textAlign="center">
                                gegen <b>{opponent}</b>
                            </Text>
                        )}
                    </Box>

                    <Text
                        margin={{ bottom: "24px" }}
                        size="xlarge"
                        textAlign="center"
                        weight="bold"
                    >
                        {gameStatus(game, username!)}
                    </Text>
                </>
            )}

            {gameBoard && game && game.guestUsername && (
                <Box margin={{ bottom: "24px" }}>
                    <GameBoard
                        gameBoard={gameBoard}
                        guestUsername={game.guestUsername}
                        disabled={!isGameBoardEnabled}
                        hostUsername={game.hostUsername}
                        isUserWon={
                            game.lastEvent.name === GameEventName.GameEndWithWinner &&
                            game.lastEvent.meta.winnerUsername === username!
                        }
                        onCellClick={makeMove}
                        username={username!}
                        winCoords={
                            (game.lastEvent.name === GameEventName.GameEndWithWinner &&
                                game.lastEvent.meta.winCoords) ||
                            undefined
                        }
                    />
                </Box>
            )}

            {isGameEnd && <RoutedAnchor path={PagePathname.Home}>Zurück zu Home</RoutedAnchor>}
        </Page>
    );
};

export const GamePlayPage = connect(({ environment }: RootState) => ({
    username:
        environment.me !== "Not Logged In" && isResponseSuccessBody(environment.me)
            ? environment.me.username
            : undefined,
}))(UnenhancedGamePlayPage);

interface GameBoardProps {
    disabled?: boolean;
    gameBoard: GameBoardType;
    guestUsername: string;
    hostUsername: string;
    isUserWon?: boolean;
    onCellClick: (row: number, column: number) => void;
    username: string;
    winCoords?: GameBoardCoords[];
}

/* TODO: after TS 3.4 release use "as const" in GameBoardCell children. */

const GameBoard = (props: GameBoardProps) => {
    const childrenOnHover =
        props.username === props.hostUsername
            ? ("X" as "X")
            : props.username === props.guestUsername
            ? ("O" as "O")
            : undefined;

    return (
        <table>
            <tbody>
                {props.gameBoard.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((column, columnIndex) => {
                            // Is cell a part of win coords?
                            const isWinCell =
                                props.winCoords &&
                                props.winCoords.some(
                                    (winCoord) =>
                                        winCoord.row === rowIndex && winCoord.column === columnIndex
                                );

                            return (
                                <GameBoardCell
                                    childrenOnHover={childrenOnHover}
                                    color={
                                        isWinCell
                                            ? props.isUserWon
                                                ? "#333"
                                                : "#ff4040"
                                            : undefined
                                    }
                                    disabled={props.disabled}
                                    key={columnIndex}
                                    onClick={() => props.onCellClick(rowIndex, columnIndex)}
                                >
                                    {column === props.hostUsername
                                        ? ("X" as "X")
                                        : column === props.guestUsername
                                        ? ("O" as "O")
                                        : null}
                                </GameBoardCell>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

interface GameBoardCellProps {
    // childrenOnHover is shown when the cell hovered.
    childrenOnHover?: "X" | "O";

    // className's value should only come from styled-components.
    // You must not use this prop.
    className?: string;

    children: "X" | "O" | null;
    color?: string;
    disabled?: boolean;
    onClick: () => void;
}

const UnstyledGameBoardCell = ({
    childrenOnHover,
    children,
    className,
    disabled,
    onClick,
}: GameBoardCellProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <td
            className={className}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={disabled ? undefined : onClick}
            style={
                isHovered && !children && !disabled ? { color: "rgba(79, 79, 79, 0.5)" } : undefined
            }
        >
            {children || (isHovered && !disabled && childrenOnHover) || null}
        </td>
    );
};

const GameBoardCell = styled(UnstyledGameBoardCell)`
    border: 1px solid ${(props) => (props.disabled ? "#dadada" : "#4f4f4f")};
    color: ${(props) => props.color || (props.disabled ? "#dadada" : "#4f4f4f")};
    cursor: ${(props) => (props.disabled || props.children !== null ? "not-allowed" : "pointer")};
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    height: 60px;
    width: 60px;
`;
