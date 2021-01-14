import React from "react";
import "../styles/globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

export default MyApp;
