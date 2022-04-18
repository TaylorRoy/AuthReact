import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  logIn: (token) => {},
  logOut: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime(); //convert to date object
  console.log("adj", adjExpirationTime);
  const remainingDuration = adjExpirationTime - currentTime;
  console.log("rem", remainingDuration);
  return remainingDuration;
};

const retreiveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retreiveStoredToken(); //
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token; //boolean

  const logOutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const logInHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime); //must be string

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logOutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logOutHandler, tokenData.duration); //get time if token still has more than 6000ms remaining
    }
  }, [tokenData, logOutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    logIn: logInHandler,
    logOut: logOutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
