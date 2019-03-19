import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Switch from "react-router-dom/Switch";

import NavBar from "./../components/NavBar/NavBar";
import Home from "./../components/Home/Home";
import MyData from "./../components/MyData/MyData";
import SendNotification from "./../components/SendNotification/SendNotification";
import ListNotification from "./../components/ListNotification/ListNotification";
import OSTab from "../components/ListOS/OSTab";
import SignIn from "./../components/Login/SignIn";
import SignUp from "./../components/Login/SignUp";
import ForgotPassword from "./../components/Login/ForgotPassword";
import Page404 from "./../components/Errors/Error404";

const AuthRoute = function({ Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        JSON.parse(localStorage.getItem("isLogged")) ? (
          <div>
            <NavBar />
            <Component />
          </div>
        ) : (
          <SignIn />
        )
      }
    />
  );
};

const NonAuthRoute = function({ Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        JSON.parse(localStorage.getItem("isLogged")) ? <Home /> : <Component />
      }
    />
  );
};

export default () => (
  <BrowserRouter>
    <div>
      <div className="container">
        <Switch>
          <AuthRoute exact path="/" Component={Home} />
          <AuthRoute exact path="/app" Component={Home} />
          <AuthRoute exact path="/home" Component={Home} />
          <AuthRoute exact path="/myData" Component={MyData} />
          <AuthRoute
            exact
            path="/sendNotification"
            Component={SendNotification}
          />
          <AuthRoute
            exact
            path="/listNotification"
            Component={ListNotification}
          />
          <AuthRoute exact path="/ListOS" Component={OSTab} />
          <NonAuthRoute exact path="/signin" Component={SignIn} />
          <NonAuthRoute exact path="/signup" Component={SignUp} />
          <NonAuthRoute
            exact
            path="/forgotpassword"
            Component={ForgotPassword}
          />
          <Route component={Page404} />
        </Switch>
      </div>
    </div>
  </BrowserRouter>
);
