import { AxiosResponse } from "axios";
import { Formik, Field, FieldProps } from "formik";
import {
    Heading,
    RoutedAnchor,
    Text,
    Box,
    Layer,
    FormField,
    TextInput,
    Form,
    Button,
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
} from "grommet";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import socketIo from "socket.io-client";

import { GamesCreatePostResponseBody } from "../../../common/types/api/games/create/post/ResponseBody";
import { GamesCreatePostRequestBody } from "../../../common/types/api/games/create/post/RequestBody";
import { GamesOfMeGetResponseBody } from "../../../common/types/api/games/of_me/get/ResponseBody";
import { GamesListEventName, GamesListEventData } from "../../../common/types/sockets/GamesList";
import { Page } from "../components/Page";
import { randomName } from "../utils/RandomName";
import { axios, isResponseSuccessBody } from "../utils/Api";
import { Game, GameId, gameStatus } from "../../../common/types/Game";
import {
    SocketServerUrl,
    SocketNamespacePathname,
    PagePathname,
    gamesPlayPagePathname,
    ApiPathname,
} from "../../../common/Urls";
import { RootState } from "../stores/rootStore/RootTypes";

interface HomePageReduxProps {
    username: string | undefined;
}

type HomePageProps = HomePageReduxProps & RouteComponentProps;

const UnenhancedHomePage = ({ location, history, username }: HomePageProps) => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const socket = socketIo(SocketServerUrl + SocketNamespacePathname.GamesList);
        socket.on(GamesListEventName, (games: GamesListEventData) => setGames(games));

        return () => {
            socket.close();
        };
    }, []);

    const closeModal = () => history.push("/home");

    return (
        <Page isLoading={username === undefined} title="Home">
            <Heading level="1">Tic-Tac-Toe</Heading>

            <Box margin={{ bottom: "16px" }}>
                <RoutedAnchor path="#join-game">Spiel beitreten</RoutedAnchor>
            </Box>
            {location.hash === "#join-game" && <JoinGameModal games={games} onClose={closeModal} />}

            <Box margin={{ bottom: "16px" }}>
                <RoutedAnchor path="#create-game">Spiel erstellen</RoutedAnchor>
            </Box>
            {location.hash === "#create-game" && (
                <CreateGameModal
                    goToGamePlayPage={gameId => history.push(gamesPlayPagePathname(gameId))}
                    onClose={closeModal}
                />
            )}

            <Box margin={{ bottom: "16px" }}>
                <RoutedAnchor path="#games-of-me">Meine Spiele</RoutedAnchor>
            </Box>
            {location.hash === "#games-of-me" && <GamesOfMeModal onClose={closeModal} username={username!} />}

            <RoutedAnchor color="status-critical" path={PagePathname.Logout}>
                Logout
            </RoutedAnchor>
        </Page>
    );
};

export const HomePage = connect(({ environment }: RootState) => ({
    username:
        isResponseSuccessBody(environment.me) && environment.me !== "Not Logged In"
            ? environment.me.username
            : undefined,
}))(UnenhancedHomePage);

interface HomeModalProps {
    onClose: () => void;
}

interface JoinGameModalProps extends HomeModalProps {
    games: Game[];
}

const JoinGameModal = ({ games, onClose }: JoinGameModalProps) => (
    <Layer onClickOutside={onClose} onEsc={onClose} responsive={false} style={{ maxHeight: "1000px" }}>
        <Box pad="medium">
            {games.length === 0 ? (
                <Text>Keine Spiele ...</Text>
            ) : (
                <Table>
                    <TableHeader>
                        <TableCell scope="col">Name</TableCell>
                        <TableCell scope="col">Author</TableCell>
                        <TableCell scope="col">Größe</TableCell>
                    </TableHeader>
                    <TableBody>
                        {games.map(game => (
                            <TableRow>
                                <TableCell scope="row">
                                    <RoutedAnchor path={gamesPlayPagePathname(game.id)}>{game.name}</RoutedAnchor>
                                </TableCell>
                                <TableCell>{game.hostUsername}</TableCell>
                                <TableCell>
                                    {game.size}x{game.size}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    </Layer>
);

interface CreateGameProps extends HomeModalProps {
    goToGamePlayPage: (gameId: GameId) => void;
}

const CreateGameModal = ({ goToGamePlayPage, onClose }: CreateGameProps) => (
    <Layer onClickOutside={onClose} onEsc={onClose} responsive={false}>
        <Box pad="medium">
            <Formik
                initialValues={{ name: randomName(), size: 3 } as GamesCreatePostRequestBody}
                onSubmit={values => {
                    axios
                        .post(ApiPathname.GamesCreate, values)
                        .then((response: AxiosResponse<GamesCreatePostResponseBody>) => {
                            goToGamePlayPage(response.data);
                        });
                }}
                render={({ handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box align="start">
                            <Field
                                name="name"
                                render={({ field }: FieldProps) => (
                                    <FormField label="Spielname">
                                        <TextInput {...field} />
                                    </FormField>
                                )}
                            />

                            <Field
                                name="size"
                                render={({ field }: FieldProps) => (
                                    <Box align="center" direction="row" margin={{ bottom: "16px" }}>
                                        <Text>Größe:</Text> <SizeInput {...field} /> x {values.size}
                                    </Box>
                                )}
                            />

                            <Button alignSelf="center" label="Erstellen" primary type="submit" />
                        </Box>
                    </Form>
                )}
            />
        </Box>
    </Layer>
);

interface GamesOfMeModalProps extends HomeModalProps {
    username: string;
}

const GamesOfMeModal = ({ onClose, username }: GamesOfMeModalProps) => {
    const [games, setGames] = useState<Game[] | "Loading">("Loading");

    useEffect(() => {
        axios
            .get(ApiPathname.GamesOfMe)
            .then((response: AxiosResponse<GamesOfMeGetResponseBody>) => setGames(response.data));
    }, []);

    return (
        <Layer onClickOutside={onClose} onEsc={onClose} responsive={false} style={{ maxHeight: "1000px" }}>
            <Box pad="medium">
                {games === "Loading" ? (
                    <Text>Laden ...</Text>
                ) : games.length === 0 ? (
                    <Text>Du hast noch nicht gespielt</Text>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableCell scope="col">Name</TableCell>
                            <TableCell scope="col">Status</TableCell>
                            <TableCell scope="col">Autor</TableCell>
                            <TableCell scope="col">Gast</TableCell>
                            <TableCell scope="col">Größe</TableCell>
                        </TableHeader>
                        <TableBody>
                            {games.map(game => (
                                <TableRow>
                                    <TableCell scope="row">
                                        <RoutedAnchor path={gamesPlayPagePathname(game.id)}>{game.name}</RoutedAnchor>
                                    </TableCell>
                                    <TableCell>{gameStatus(game, username)}</TableCell>
                                    <TableCell>{game.hostUsername}</TableCell>
                                    <TableCell>{game.guestUsername}</TableCell>
                                    <TableCell>
                                        {game.size}x{game.size}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Layer>
    );
};

interface SizeInputProps {
    disabled?: boolean;
    name?: string;
    onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    value: number;
}

const SizeInput = (props: SizeInputProps) => (
    <Box margin={{ left: "8px", right: "8px" }} width="60px">
        <TextInput {...props} type="number" />
    </Box>
);
