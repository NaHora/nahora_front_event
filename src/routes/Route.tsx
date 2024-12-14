import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

type ProtectedRouteProps = {
  children: JSX.Element;
  type: 'private' | 'public';
  redirectTo: string;
};

export const ProtectedRoute = ({
  children,
  type,
  redirectTo,
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (type === 'private') {
    return user ? children : <Navigate to={redirectTo} />;
  }

  if (type === 'public') {
    return !user ? children : <Navigate to={redirectTo} />;
  }

  return null;
};
