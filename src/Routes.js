import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Farming from "./components/home";
import ExchangeSyxPage from "./pages/ExchangeSyxPage";
import ExchangeSVLXPage from "./pages/ExchangeSVLXPage";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Farming} />
    <Route path="/home" component={Farming} />
    <Route path="/exchange" component={ExchangeSyxPage} />
    <Route path="/exchangeSVLX" component={ExchangeSVLXPage} />
    <Route path="*" component={Farming} />
  </Switch>
);
export default Routes;
