import React, { useCallback, useEffect, useState } from "react";

export const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { },
});

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjustedExpirationTime = new Date(expirationTime).getTime();

    const remainingTime = adjustedExpirationTime - currentTime;

    return remainingTime;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationTime);

    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    } else {
        return {
            token: storedToken,
            duration: remainingTime
        }
    }
};

export const AuthContextProvider = props => {

    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(loginHandler, 3000);
    };

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);
    useEffect(() => {
        if (logoutTimer) {
            console.log(tokenData.duration)
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };
    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthContext;