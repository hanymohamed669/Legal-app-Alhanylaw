
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleAuthProvider } from './context/GoogleAuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import CalendarPage from './pages/CalendarPage';
import DocumentsPage from './pages/DocumentsPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import ClientsPage from './pages/ClientsPage';
import ArchivePage from './pages/ArchivePage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route 
                path="/" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/cases" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <CasesPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/archive" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <ArchivePage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/cases/:caseId" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <CaseDetailPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/calendar" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <CalendarPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
             <Route 
                path="/clients" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <ClientsPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/documents" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <DocumentsPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/tasks" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <TasksPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
             <Route 
                path="/team" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <TeamPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            {/* The settings page is no longer configurable from the UI */}
            {/* Kept for users who might have it bookmarked */}
            <Route 
                path="/settings" 
                element={
                    <PrivateRoute>
                        <Layout>
                            <SettingsPage />
                        </Layout>
                    </PrivateRoute>
                } 
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <GoogleAuthProvider>
        <div className="bg-slate-200 min-h-screen font-sans">
            <HashRouter>
                <AppRoutes/>
            </HashRouter>
        </div>
      </GoogleAuthProvider>
    </AuthProvider>
  );
};

export default App;