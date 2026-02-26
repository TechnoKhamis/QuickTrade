import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import Analytics from './components/Analytics';
import Budget from './components/Budget';
import FriendLoans from './components/FriendLoans';
import LoanPlanner from './components/LoanPlanner';
import Settings from './components/Settings';
import authService from './services/authService';

function PrivateRoute({ children }) {
  const token = authService.getToken();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
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
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <PrivateRoute>
              <Categories />
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
        <Route 
          path="/friend-loans" 
          element={
            <PrivateRoute>
              <FriendLoans />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/loan-planner" 
          element={
            <PrivateRoute>
              <LoanPlanner />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </CurrencyProvider>
    </BrowserRouter>
  );
}

export default App;
