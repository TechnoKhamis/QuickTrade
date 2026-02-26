import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('BHD');

  useEffect(() => {
    fetchUserCurrency();
  }, []);

  const fetchUserCurrency = async () => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const res = await fetch('http://localhost:8080/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setCurrency(data.currency || 'BHD');
      }
    } catch (err) {
      console.error('Error fetching currency:', err);
    }
  };

  const updateCurrency = async (newCurrency) => {
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency: newCurrency })
      });

      if (res.ok) {
        setCurrency(newCurrency);
        return true;
      }
    } catch (err) {
      console.error('Error updating currency:', err);
    }
    return false;
  };

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency, refreshCurrency: fetchUserCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
