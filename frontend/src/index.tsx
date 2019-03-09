// Styles
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { render } from "react-dom";
import { ToastContainer, Slide } from "react-toastify";

import { LoginPage } from "./pages/LoginPage";

const App = () => (
    <BrowserRouter>
        <ToastContainer
            autoClose={5 * 1000}
            closeOnClick={false}
            draggable={false}
            hideProgressBar={true}
            position="bottom-left"
            transition={Slide}
        />

        <Route path="/login" component={LoginPage} />
    </BrowserRouter>
);

render(<App />, document.getElementById("react-root"));
