import React, { ReactNode } from "react";
import { AuthProvider } from "./auth";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
