/* eslint-disable react/require-default-props */
import React from "react";
import {
  Route,
  RouteProps as ReactDOMRouteProps,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/auth";

export type ProtectedRouteProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function PrivateRoute({
  authenticationPath,
  outlet,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  console.log(!!user);
  if (!!user) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
}
