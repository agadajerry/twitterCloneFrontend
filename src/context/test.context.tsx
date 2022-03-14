import React, { createContext } from "react";

export const LanguageContext = React.createContext({
  language: "en",
  setLanguage: () => {},
});
