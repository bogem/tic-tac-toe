import { GameId } from "./types/Game";

export const ApiServerPort = process.env.NODE_ENV === "production" ? 80 : 3000;
export const ApiServerUrl = `http://localhost:${ApiServerPort}`;

export const SocketServerPort = 3002;
export const SocketServerUrl = `http://localhost:${SocketServerPort}`;

export const DynamoDbUrl =
    process.env.NODE_ENV === "production" ? "dynamodb.eu-central-1.amazonaws.com" : "http://localhost:8080";

export enum PagePathname {
    Root = "/",
    Login = "/login",
    Logout = "/logout",
    Home = "/home",
}

export const gamesPlayPagePathname = (gameId: GameId | ":gameId") => `/games/${gameId}/play`;

export enum ApiPathname {
    UsersCreate = "/api/users/create",
    UsersLogin = "/api/users/login",
    UsersMe = "/api/users/me",
    UsersLogout = "/api/users/logout",

    GamesCreate = "/api/games/create",
    GamesOfMe = "/api/games/of_me",
}

export const getGameApiPathname = (gameId: GameId | ":gameId") => `/api/games/${gameId}`;
export const gameJoinApiPathname = (gameId: GameId | ":gameId") => `/api/games/${gameId}/join`;
export const gameMakeMoveApiPathname = (gameId: GameId | ":gameId") => `/api/games/${gameId}/make_move`;

export enum SocketNamespacePathname {
    GamesList = "/games/list",
    GamesState = "/games/state",
}
