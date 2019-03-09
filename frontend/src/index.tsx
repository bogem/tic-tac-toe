// Styles
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Grommet } from "grommet";
import { ToastContainer, Slide } from "react-toastify";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { GlobalStyle, theme } from "./styles";
import { LoginPage } from "./pages/LoginPage";
import { rootStore } from "./stores/rootStore/RootStore";

const App = () => (
    <BrowserRouter>
        <Provider store={rootStore}>
            <Grommet full={true} plain={true} theme={theme}>
                <GlobalStyle />

                <ToastContainer
                    autoClose={7 * 1000}
                    className="toast-container"
                    closeOnClick={false}
                    draggable={false}
                    hideProgressBar={true}
                    position="bottom-left"
                    toastClassName="toast"
                    transition={Slide}
                />

                <Route path="/login" component={LoginPage} />
            </Grommet>
        </Provider>
    </BrowserRouter>
);

render(<App />, document.getElementById("react-root"));
