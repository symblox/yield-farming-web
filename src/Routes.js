import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import Farming from "./components/home";
import ExchangeSyxPage from "./pages/ExchangeSyxPage";
import ExchangeSVLXPage from "./pages/ExchangeSVLXPage";
import {PoolContextProvider} from "./contexts/PoolContext";
import ConnectorPage from "./pages/ConnectorPage";

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Farming} />
        <Route path="/home" component={Farming} />
        <Route path="/conn" component={ConnectorPage} />
        <PoolContextProvider>
            <Route path="/exchange" component={ExchangeSyxPage} />
            <Route path="/svlx" component={ExchangeSVLXPage} />
        </PoolContextProvider>
        <Route path="*" component={Farming} />
    </Switch>
);
export default Routes;
