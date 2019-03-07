module Page.Login exposing (Model, Msg(..), init, update, view)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Encode as Encode
import Skeleton



-- MODEL


type alias Model =
    { username : String, password : String, isRegistering : Bool }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { username = "", password = "", isRegistering = False }, Cmd.none )



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
        , input [ class "mb-8", onInput EnteredUsername, placeholder "Nickname", value model.username ] []
        , input [ class "mb-8", onInput EnteredPassword, placeholder "Passwort", type_ "password", value model.password ] []
        , button [ class "mb-16", onClick ClickedSubmit ] [ text "Go" ]
        , bottomText
        ]
    }



-- UPDATE


type Msg
    = EnteredUsername String
    | EnteredPassword String
    | ClickedSubmit
    | ClickedGoToRegister
    | ClickedGoToLogin
    | LoggedIn (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        EnteredUsername username ->
            ( { model | username = username }, Cmd.none )

        EnteredPassword password ->
            ( { model | password = password }, Cmd.none )

        ClickedSubmit ->
            ( model, Http.post { url = "http://localhost:3000/api/user/new", body = Http.jsonBody (loginEncoder model), expect = Http.expectString LoggedIn } )

        ClickedGoToRegister ->
            ( { model | isRegistering = True }, Cmd.none )

        ClickedGoToLogin ->
            ( { model | isRegistering = False }, Cmd.none )

        LoggedIn result ->
            case result of
                Ok username ->
                    ( { model | username = username }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )


loginEncoder : Model -> Encode.Value
loginEncoder model =
    Encode.object
        [ ( "username", Encode.string model.username )
        , ( "password", Encode.string model.password )
        ]
