import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import authService from '../services/authService';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { currency, updateCurrency } = useCurrency();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API
    alert('Profile saved!');
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    const success = await updateCurrency(selectedCurrency);
    if (success) {
      alert('Preferences saved!');
    } else {
      alert('Failed to save preferences');
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-dot"></div> Cash<span>Wise</span>
        </div>
        <nav className="nav">
          <div className="nav-section">Overview</div>
          <div className="nav-item" onClick={() => navigate('/dashboard')}>▦ Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/analytics')}>📊 Analytics</div>
          
          <div className="nav-section">Money</div>
          <div className="nav-item" onClick={() => navigate('/transactions')}>↕ Transactions</div>
          <div className="nav-item" onClick={() => navigate('/categories')}>🏷 Categories</div>
          <div className="nav-item" onClick={() => navigate('/budget')}>🎯 Budget Goals</div>
          
          <div className="nav-section">Finance</div>
          <div className="nav-item" onClick={() => navigate('/loan-planner')}>🏦 Loan Planner</div>
          <div className="nav-item" onClick={() => navigate('/friend-loans')}>🤝 Friend Loans</div>
          
          <div className="sidebar-divider"></div>
          
          <div className="nav-section">Account</div>
          <div className="nav-item active">⚙ Settings</div>
          <div className="nav-item" onClick={handleLogout}>⤴ Sign Out</div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.fullName?.substring(0,2).toUpperCase() || 'U'}</div>
            <div>
              <div className="user-name">{user?.fullName || user?.email}</div>
              <div className="user-role">Personal · {currency}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Settings</div>
            <div className="page-sub">Customize your CashWise experience</div>
          </div>
        </div>

        <div className="settings-grid">
          {/* Profile Card */}
          <div className="settings-card">
            <div className="settings-card-title">Profile</div>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">FULL NAME</label>
                <input 
                  className="form-input" 
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input 
                  className="form-input" 
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>

              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>

          {/* Preferences Card */}
          <div className="settings-card">
            <div className="settings-card-title">Preferences</div>
            <form onSubmit={handleSavePreferences}>
              <div className="form-group">
                <label className="form-label">CURRENCY</label>
                <select 
                  className="form-input"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <option value="BHD">BHD — Bahraini Dinar</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DATE FORMAT</label>
                <select 
                  className="form-input"
                  value="YYYY-MM-DD"
                  disabled
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">Save Preferences</button>
            </form>
          </div>
        </div>

        {/* Stripe Integration Card */}
        <div className="settings-card stripe-card">
          <div className="settings-card-title">Stripe Integration</div>
          <div className="stripe-status-text">Your Stripe account is connected in test mode</div>
          
          <div className="stripe-info-grid">
            <div className="stripe-info-item">
              <div className="stripe-info-label">CUSTOMER ID</div>
              <div className="stripe-info-value">{user?.stripeCustomerId || 'cus_UZ11yiTcJCR33c2'}</div>
            </div>
            
            <div className="stripe-info-item">
              <div className="stripe-info-label">PAYMENT METHOD</div>
              <div className="stripe-info-value">Visa •••• 4242</div>
            </div>
            
            <div className="stripe-info-item">
              <div className="stripe-info-label">MODE</div>
              <div className="stripe-status-badge">● Test Active</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
