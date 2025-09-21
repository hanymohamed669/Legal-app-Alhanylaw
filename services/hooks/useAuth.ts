
import { useContext } from 'react';
import { useAuth as useAuthFromContext } from '../../context/AuthContext';

// This is a convenience export to allow for a cleaner import path
// e.g. import { useAuth } from '../hooks/useAuth'
export const useAuth = useAuthFromContext;