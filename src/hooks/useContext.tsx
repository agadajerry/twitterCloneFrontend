import React,{ createContext } from "react";

// export const UserContext :any= createContext(null);


export const UserContext = React.createContext({
  user: "en",
  setUser: () => {},
});