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

    .toast {
        background: #fff !important;
        border-radius: 6px !important;
        border: 1px solid #dadada !important;
        box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.2) !important;
        color: #3f3f3f !important;
        padding: 16px !important;
    }

    .toast-container {
        .Toastify__toast--error {
            background: #fff !important;
            color: #ff4040 !important;
        }

        .Toastify__toast--success {
            background: #fff !important;
            color: #00c781 !important;
        }

        .Toastify__close-button {
            color: #3f3f3f !important;
        }
    }
`;
