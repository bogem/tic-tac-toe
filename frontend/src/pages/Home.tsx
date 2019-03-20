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
import { toast } from "react-toastify";
import socketIo from "socket.io-client";

import { Page } from "../components/Page";
import { getRandomName } from "../utils/GetRandomName";
import { axios } from "../utils/Api";

export const HomePage = ({ location, history }: RouteComponentProps) => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const socket = socketIo("http://localhost:3002/games/list");
        socket.on("games_list", (games: Game[]) => setGames(games));

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

interface JoinGameModalProps extends HomeModalProps {
    games: Game[];
}

const JoinGameModal = ({ games, onClose }: JoinGameModalProps) => (
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
                                <TableCell scope="row">
                                    <RoutedAnchor path={`/game/play/${game.id}`}>{game.name}</RoutedAnchor>
                                </TableCell>
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

const CreateGameModal = ({ onClose }: HomeModalProps) => (
    <Layer onClickOutside={onClose} onEsc={onClose}>
        <Box pad="medium">
            <Formik
                initialValues={{ name: getRandomName(), size: 3 }}
                onSubmit={values => {
                    axios.post("/api/games/create", values).then(() => {
                        toast("Spiel erfolgreich erstellt");
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
