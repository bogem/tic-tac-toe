import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";

const App = () => <BrowserRouter />;

render(<App />, document.getElementById("react-root"));
