module Page.Login exposing (Model, Msg(..), init, update, view)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Skeleton



-- MODEL


type alias Model =
    { login : String, password : String, isRegistering : Bool }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { login = "", password = "", isRegistering = False }, Cmd.none )



-- VIEW


view : Model -> Skeleton.Details Msg
view model =
    let
        title =
            if model.isRegistering then
                "Registrieren"

            else
                "Einloggen"

        bottomText =
            if model.isRegistering then
                p [] [ text "Du hast schon einen Account? ", button [ class "button--link", onClick ClickedGoToLogin ] [ text "Log dich ein." ] ]

            else
                p [] [ text "Du hast noch keinen Account? ", button [ class "button--link", onClick ClickedGoToRegister ] [ text "Registier dich jetzt." ] ]
    in
    { title = title
    , children =
        [ h1 [] [ text "Tic-Tac-Toe" ]
        , h2 [] [ text title ]
        , input [ class "mb-8", onInput EnteredLogin, placeholder "Nickname", value model.login ] []
        , input [ class "mb-8", onInput EnteredPassword, placeholder "Passwort", value model.password ] []
        , button [ class "mb-16", onClick ClickedSubmit ] [ text "Go" ]
        , bottomText
        ]
    }



-- UPDATE


type Msg
    = EnteredLogin String
    | EnteredPassword String
    | ClickedSubmit
    | ClickedGoToRegister
    | ClickedGoToLogin


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EnteredLogin login ->
            ( { model | login = login }, Cmd.none )

        EnteredPassword password ->
            ( { model | password = password }, Cmd.none )

        ClickedSubmit ->
            ( model, Cmd.none )

        ClickedGoToRegister ->
            ( { model | isRegistering = True }, Cmd.none )

        ClickedGoToLogin ->
            ( { model | isRegistering = False }, Cmd.none )
