
import { useContext } from 'react';
import { useGoogleAuth as useGoogleAuthFromContext } from '../../context/GoogleAuthContext';

// This is a convenience export to allow for a cleaner import path
// e.g. import { useGoogleAuth } from '../hooks/useGoogleAuth'
export const useGoogleAuth = useGoogleAuthFromContext;
