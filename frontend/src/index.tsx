// Styles
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Grommet } from "grommet";
import { ToastContainer, Slide } from "react-toastify";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";

import { GlobalStyle, theme } from "./styles";
import { LoginPage } from "./pages/Login";
import { rootStore } from "./stores/rootStore/RootStore";
import { HomePage } from "./pages/Home";
import { RootDispatch } from "./stores/rootStore/RootTypes";
import { environmentGetEnvironment } from "./stores/environmentStore/EnvironmentThunks";
import { RootPage } from "./pages/Root";
import { GamePlayPage } from "./pages/GamePlay";
import { NavBar } from "./components/NavBar";
import { LogoutPage } from "./pages/Logout";
import { PagePathname, gamesPlayPagePathname } from "../../common/Urls";

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

                <EnvironmentLoader />

                <NavBar />

                <Switch>
                    <Route path={PagePathname.Root} exact component={RootPage} />
                    <Route path={PagePathname.Login} component={LoginPage} />
                    <Route path={PagePathname.Logout} component={LogoutPage} />
                    <Route path={PagePathname.Home} component={HomePage} />
                    <Route path={gamesPlayPagePathname(":gameId")} component={GamePlayPage} />
                    <Route path="/" component={() => <h1>404 Page Not Found</h1>} />
                </Switch>
            </Grommet>
        </Provider>
    </BrowserRouter>
);

interface EnvironmentLoaderProps {
    getEnvironment: () => void;
}

const UnenhancedEnvironmentLoader = (props: EnvironmentLoaderProps) => {
    React.useEffect(props.getEnvironment, []);

    return null;
};

const EnvironmentLoader = connect(
    null,
    (dispatch: RootDispatch) => ({
        getEnvironment: () => {
            dispatch(environmentGetEnvironment());
        },
    })
)(UnenhancedEnvironmentLoader);

render(<App />, document.getElementById("react-root"));
