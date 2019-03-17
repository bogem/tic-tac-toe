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

import { Page } from "../components/Page";
import { getRandomName } from "../utils/GetRandomName";
import { axios } from "../utils/Api";
import { toast } from "react-toastify";

export const HomePage = ({ location, history }: RouteComponentProps) => {
    const closeModal = () => history.push("/home");

    return (
        <Page title="Home">
            <Heading level="1">Tic-Tac-Toe</Heading>

            <Box margin={{ bottom: "16px" }}>
                <RoutedAnchor path="#join-game">Spiel beitreten</RoutedAnchor>
            </Box>
            {location.hash === "#join-game" && <JoinGameModal onClose={closeModal} />}

            <RoutedAnchor path="#create-game">Spiel erstellen</RoutedAnchor>
            {location.hash === "#create-game" && <CreateGameModal onClose={closeModal} />}
        </Page>
    );
};

interface HomeModalProps {
    onClose: () => void;
}

interface Game {
    id: string;
    name: string;
    creatorUsername: string;
    size: number;
}

const JoinGameModal = ({ onClose }: HomeModalProps) => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const socket = socketIo("http://localhost:3002/games/list");
        socket.on("games_list", (games: Game[]) => setGames(games));

        return () => {
            socket.close();
        };
    }, []);

    return (
        <Layer onClickOutside={onClose} onEsc={onClose}>
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
                                    <TableCell scope="row">{game.name}</TableCell>
                                    <TableCell>{game.creatorUsername}</TableCell>
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

const CreateGameModal = ({ onClose }: HomeModalProps) => (
    <Layer onClickOutside={onClose} onEsc={onClose}>
        <Box pad="medium">
            <Formik
                initialValues={{ name: getRandomName(), size: 3 }}
                onSubmit={values => {
                    axios.post("/api/games/create", { values }).then(() => {
                        toast("Spiel erfolgreich erstellt");
                    });
                }}
                render={({ handleSubmit, values }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box align="center">
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
                                    <label>
                                        Größe: <input {...field} type="number" /> x{" "}
                                        <input disabled readOnly value={values.size} />
                                    </label>
                                )}
                            />

                            <Button label="Erstellen" primary type="submit" />
                        </Box>
                    </Form>
                )}
            />
        </Box>
    </Layer>
);
