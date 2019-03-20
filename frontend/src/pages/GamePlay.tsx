import queryString from "query-string";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { Heading, Text } from "grommet";
import { range } from "lodash";
import styled, { css } from "styled-components";

import { Page } from "../components/Page";
import { axios } from "../utils/Api";

export const GamePlayPage = ({ location }: RouteComponentProps) => {
    const { gameId } = queryString.parse(location.search) as { gameId: string };

    useEffect(() => {
        axios.post(`/api/games/join/${gameId}`);
    }, [gameId]);

    return (
        <Page title="Spielen">
            <Heading level="1">SPIEL!</Heading>
            <Text margin={{ bottom: "24px" }}>
                <b>Aktuelle Stand:</b> Warten auf Opponent ...
            </Text>
            <Board />
        </Page>
    );
};

const Board = () => (
    <table>
        <tbody>
            {range(3).map(row => (
                <tr key={row}>
                    {range(3).map(column => (
                        <BoardCell disabled={true} key={column} />
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

interface BoardCellProps {
    disabled?: boolean;
}

const BoardCell = styled.td<BoardCellProps>`
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
