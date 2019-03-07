module Skeleton exposing (Details, view)

import Browser
import Html exposing (..)
import Html.Attributes exposing (style)


type alias Details msg =
    { title : String
    , children : List (Html msg)
    }


view : (a -> msg) -> Details a -> Browser.Document msg
view toMsg details =
    { title = details.title
    , body =
        [ Html.map toMsg <|
            main_
                [ style "align-items" "center"
                , style "display" "flex"
                , style "flex-direction" "column"
                , style "flex-grow" "1"
                , style "justify-content" "center"
                ]
                details.children
        ]
    }
