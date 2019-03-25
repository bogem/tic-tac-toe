import { createGlobalStyle } from "styled-components";

export const theme = {
    anchor: {
        color: "neutral-3",
    },
    button: {
        border: {
            color: "neutral-3",
            radius: "16px",
            width: "3px",
        },
        primary: {
            color: "neutral-3",
        },
    },
    global: {
        focus: {
            border: {
                color: "neutral-3",
            },
        },
    },
    grommet: {
        extend: `
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            min-width: 100%;
            overflow: auto;
        `,
    },
};

export const GlobalStyle = createGlobalStyle`
    /* --- normalize.css --- */

    /*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */

    /* we use a shortened version, since we also use reset.css and set some basic styles in base.css */

    /**
    * Prevent adjustments of font size after orientation changes in iOS.
    */
    html {
        -webkit-text-size-adjust: 100%;
    }

    /**
    * 1. Add the correct box sizing in Firefox.
    * 2. Show the overflow in Edge and IE.
    */

    hr {
        box-sizing: content-box; /* 1 */
        height: 0; /* 1 */
        overflow: visible; /* 2 */
    }

    /**
    * Show the overflow in Edge.
    */
    button,
    input {
        overflow: visible;
    }

    /**
    * Remove the inheritance of text transform in Firefox.
    */
    button,
    select {
        text-transform: none;
    }

    /**
    * Restore the focus styles unset by the previous rule.
    */
    button:-moz-focusring,
    [type="button"]:-moz-focusring,
    [type="reset"]:-moz-focusring,
    [type="submit"]:-moz-focusring {
        outline: 1px dotted ButtonText;
    }

    /**
    * Correct the cursor style of increment and decrement buttons in Chrome.
    */
    [type="number"]::-webkit-inner-spin-button,
    [type="number"]::-webkit-outer-spin-button {
        height: auto;
    }

    /**
    * 1. Correct the odd appearance in Chrome and Safari.
    * 2. Correct the outline style in Safari.
    */
    [type="search"] {
        -webkit-appearance: textfield; /* 1 */
        outline-offset: -2px; /* 2 */
    }
    /**
    * Remove the inner padding in Chrome and Safari on macOS.
    */
    [type="search"]::-webkit-search-decoration {
        -webkit-appearance: none;
    }

    /**
    * 1. Correct the inability to style clickable types in iOS and Safari.
    * 2. Change font properties to "inherit" in Safari.
    */
    ::-webkit-file-upload-button {
        -webkit-appearance: button; /* 1 */
        font: inherit; /* 2 */
    }

    /* --- reset.css --- */

    /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
    */

    ol,
    ul {
        margin: 1em 0;
        padding: 0 0 0 40px;
    }
    li {
        display: list-item;
    }

    blockquote:before,
    blockquote:after {
        content: "";
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    /* --- base styles --- */

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        color: #3f3f3f;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size: 18px;
        height: 100%;
        line-height: 1;
        min-width: 320px;
        width: 100%;
    }

    body {
        background: #fff;
        min-height: 100%;
        min-width: 100%;
        position: relative;
    }

    #react-root {
        min-height: 100vh;
        min-width: 100%;
        overflow: auto;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    li {
        line-height: 1.3;
        margin-top: 0;
    }

    a {
        color: inherit;
        text-decoration: inherit;
    }

    /* --- toast styles --- */


    /**
       MIT License
       Copyright (c) 2017 Fadi Khadra

       Copied from https://github.com/fkhadra/react-toastify/blob/master/dist/ReactToastify.css.
    */
    .Toastify__toast-container {
  color: #fff;
    box-sizing: border-box;
    padding: 4px;
    position: fixed;
    width: 320px;
    z-index: 9999;
  }
    .Toastify__toast-container--bottom-left {
        bottom: 1em;
        left: 1em; }

    @media only screen and (max-width: 480px) {
    .Toastify__toast-container {
        width: 100vw;
        padding: 0;
        left: 0;
        margin: 0; }
        .Toastify__toast-container--bottom-left { bottom: 0; }
    }

    .Toastify__toast {
        background: #fff;
        border-radius: 6px;
        border: 1px solid #dadada;
        box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        color: #3f3f3f;
        cursor: pointer;
        display: flex;
        font-family: sans-serif;
        justify-content: space-between;
        margin-bottom: 1rem;
        max-height: 800px;
        min-height: 64px;
        overflow: hidden;
        padding: 16px;
        position: relative;
    }
    .Toastify__toast--default {
        background: #fff;
        color: #aaa; }
    .Toastify__toast--info {
        background: #3498db; }
    .Toastify__toast--success {
        background: #fff;
        color: #00c781;
    }
    .Toastify__toast--warning {
        background: #f1c40f; }
    .Toastify__toast--error {
        background: #fff;
        color: #ff4040;
     }
    .Toastify__toast-body {
        margin: auto 0;
        -ms-flex: 1;
            flex: 1; }

    @media only screen and (max-width: 480px) {
    .Toastify__toast {
        margin-bottom: 0; } }

    .Toastify__close-button {
    color: #3f3f3f;
    font-weight: bold;
    font-size: 14px;
    background: transparent;
    outline: none;
    border: none;
    padding: 0;
    cursor: pointer;
    opacity: 0.7;
    transition: 0.3s ease;
    -ms-flex-item-align: start;
        align-self: flex-start; }
    .Toastify__close-button--default {
        color: #000;
        opacity: 0.3; }
    .Toastify__close-button:hover, .Toastify__close-button:focus {
        opacity: 1; }

    @keyframes Toastify__slideInLeft {
    from {
        transform: translate3d(-110%, 0, 0);
        visibility: visible; }
    to {
        transform: translate3d(0, 0, 0); } }


    @keyframes Toastify__slideOutLeft {
    from {
        transform: translate3d(0, 0, 0); }
    to {
        visibility: hidden;
        transform: translate3d(-110%, 0, 0); } }

    .Toastify__slide-enter--bottom-left {
    animation-name: Toastify__slideInLeft; }

    .Toastify__slide-exit--bottom-left {
    animation-name: Toastify__slideOutLeft; }
`;
