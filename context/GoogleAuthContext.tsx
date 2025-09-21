
import React, { createContext, useContext, ReactNode } from 'react';

// This context is now a placeholder as Google Drive integration has been removed.
// It provides a default structure to prevent crashes in components that may still use the hook.
const dummyContext = {
    isConfigured: false,
    isInitialized: true,
    isSignedIn: false,
    signIn: () => Promise.resolve(),
    signOut: () => {},
    uploadFile: (_file: File) => Promise.reject(new Error('Google Drive integration has been removed.')),
    createShareableLink: (_fileId: string) => Promise.reject(new Error('Google Drive integration has been removed.')),
};

interface GoogleAuthContextType {
    isConfigured: boolean;
    isInitialized: boolean;
    isSignedIn: boolean;
    signIn: () => Promise<void>;
    signOut: () => void;
    uploadFile: (file: File) => Promise<any>;
    createShareableLink: (fileId: string) => Promise<string>;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GoogleAuthContext.Provider value={dummyContext}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = (): GoogleAuthContextType => {
    const context = useContext(GoogleAuthContext);
    if (context === undefined) {
        // This should not happen if the provider is in place, but as a fallback:
        return dummyContext;
    }
    return context;
};