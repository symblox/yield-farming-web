import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as JotaiProvider } from "jotai";

import { LanguageProvider } from "./contexts/LanguageContext";
import { Web3Provider } from "./contexts/Web3Context";

import interestTheme from "./theme";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <JotaiProvider>
        <LanguageProvider>
          <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
            <CssBaseline />
            <Web3Provider>
              <Router>
                <Routes />
              </Router>
            </Web3Provider>
          </MuiThemeProvider>
        </LanguageProvider>
      </JotaiProvider>
    );
  }
}

export default App;
