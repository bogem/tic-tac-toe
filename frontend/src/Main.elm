module Main exposing (Model, Msg(..), Page(..), init, main, subscriptions, update, view)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (src)
import Page.Login as Login
import Skeleton
import Url
import Url.Parser as Parser exposing ((</>), Parser, map, oneOf, s, top)



-- MAIN


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }



-- MODEL


type alias Model =
    { key : Nav.Key, page : Page }


type Page
    = NotFound
    | Login Login.Model


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    stepUrl url { key = key, page = NotFound }



-- VIEW


view : Model -> Browser.Document Msg
view model =
    case model.page of
        NotFound ->
            let
                title =
                    "Page Not Found"
            in
            { title = title, body = [ h1 [] [ text title ] ] }

        Login login ->
            Skeleton.view LoginMsg (Login.view login)



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | LoginMsg Login.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.key (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        UrlChanged url ->
            stepUrl url model

        LoginMsg loginMsg ->
            case model.page of
                Login login ->
                    stepLogin model (Login.update loginMsg login)

                _ ->
                    ( model, Cmd.none )



-- ROUTER


stepUrl : Url.Url -> Model -> ( Model, Cmd Msg )
stepUrl url model =
    let
        parser =
            oneOf [ map (stepLogin model (Login.init ())) (s "login") ]
    in
    case Parser.parse parser url of
        Just answer ->
            answer

        Nothing ->
            ( { model | page = NotFound }, Cmd.none )


stepLogin : Model -> ( Login.Model, Cmd Login.Msg ) -> ( Model, Cmd Msg )
stepLogin model ( login, cmd ) =
    ( { model | page = Login login }, Cmd.map LoginMsg cmd )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
