import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Budget from './components/Budget';
import authService from './services/authService';

function PrivateRoute({ children }) {
  const token = authService.getToken();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/budget" 
          element={
            <PrivateRoute>
              <Budget />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
