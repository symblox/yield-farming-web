import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import Farming from "./components/home";

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Farming} />
        <Route path="/home" component={Farming} />
        <Route path="*" component={Farming} />
    </Switch>
);
export default Routes;
