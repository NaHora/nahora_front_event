import React, { ReactNode } from 'react';
import { EventProvider } from '../contexts/EventContext';
import { AuthProvider } from './auth';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <EventProvider>{children}</EventProvider>
    </AuthProvider>
  );
};

export default AppProvider;
