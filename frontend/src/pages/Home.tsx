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
import socketIo from "socket.io-client";
import * as yup from "yup";

import { GamesCreatePostResponseBody } from "../../../common/types/api/games/create/post/ResponseBody";
import { GamesCreatePostRequestBody } from "../../../common/types/api/games/create/post/RequestBody";
import { GamesListEventName, GamesListEventData } from "../../../common/types/sockets/GamesList";
import { Page } from "../components/Page";
import { randomName } from "../utils/RandomName";
import { axios } from "../utils/Api";
import { Game, GameId } from "../../../common/types/Game";
import {
    SocketServerUrl,
    SocketNamespacePathname,
    PagePathname,
    gamesPlayPagePathname,
    ApiPathname,
} from "../../../common/Urls";

export const HomePage = ({ location, history }: RouteComponentProps) => {
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
        <Page title="Home">
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
                    goToGamePlayPage={(gameId) => history.push(gamesPlayPagePathname(gameId))}
                    onClose={closeModal}
                />
            )}

            <Box margin={{ bottom: "16px" }}>
                <RoutedAnchor path={PagePathname.GamesOfMe}>Meine Spiele</RoutedAnchor>
            </Box>

            <RoutedAnchor color="status-critical" path={PagePathname.Logout}>
                Logout
            </RoutedAnchor>
        </Page>
    );
};

interface HomeModalProps {
    onClose: () => void;
}

interface JoinGameModalProps extends HomeModalProps {
    games: Game[];
}

const JoinGameModal = ({ games, onClose }: JoinGameModalProps) => (
    <Layer
        onClickOutside={onClose}
        onEsc={onClose}
        responsive={false}
        style={{ maxHeight: "1000px" }}
    >
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
                        {games.map((game) => (
                            <TableRow>
                                <TableCell scope="row">
                                    <RoutedAnchor path={gamesPlayPagePathname(game.id)}>
                                        {game.name}
                                    </RoutedAnchor>
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
                initialValues={
                    {
                        name: randomName(),
                        size: 3,
                    } as GamesCreatePostRequestBody
                }
                onSubmit={(values) => {
                    axios
                        .post(ApiPathname.GamesCreate, values)
                        .then((response: AxiosResponse<GamesCreatePostResponseBody>) => {
                            goToGamePlayPage(response.data);
                        });
                }}
                validationSchema={yup.object().shape({
                    name: yup.string().required("Bitte Spielname eingeben."),
                    size: yup
                        .number()
                        .required("Bitte Feldgröße eingeben.")
                        .min(3, "Minimal zulässige Feldgröße ist 3.")
                        .max(20, "Maximal zulässige Feldgröße ist 20."),
                })}
                render={({ errors, handleSubmit, touched, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box align="start">
                            <Field
                                name="name"
                                render={({ field }: FieldProps) => (
                                    <FormField
                                        error={touched.name && errors.name}
                                        label="Spielname"
                                    >
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

                            {touched.size && errors.size && (
                                <Box margin={{ bottom: "16px" }}>
                                    <Text color="status-error" textAlign="center">
                                        {errors.size}
                                    </Text>
                                </Box>
                            )}

                            <Button alignSelf="center" label="Erstellen" primary type="submit" />
                        </Box>
                    </Form>
                )}
            />
        </Box>
    </Layer>
);

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
