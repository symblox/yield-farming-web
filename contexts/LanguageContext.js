import React, { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import enUs from "../lib/language/en_US";
import zhCn from "../lib/language/zh_CN";
import { languageOptions } from "../lib/constants";

export const LanguageContext = React.createContext({});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(languageOptions[0]); //default en
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.indexOf("cn") >= 0 || browserLang.indexOf("zh") >= 0) {
      setLanguage(languageOptions[1]);
    } else {
      setLanguage(languageOptions[0]);
    }
  }, [setLanguage]);
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      <IntlProvider
        locale={"en"}
        messages={language.key === "en" ? enUs : zhCn}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
