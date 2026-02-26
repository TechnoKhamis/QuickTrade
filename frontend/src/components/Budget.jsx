import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import './Budget.css';

function Budget() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    limitAmount: '',
    month: new Date().toISOString().slice(0, 7) + '-01'
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/budgets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setBudgets(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.filter(cat => cat.type === 'EXPENSE'));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/budgets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryId: parseInt(formData.categoryId),
          limitAmount: parseFloat(formData.limitAmount),
          month: formData.month
        })
      });
      
      if (res.ok) {
        setShowDrawer(false);
        setFormData({
          categoryId: '',
          limitAmount: '',
          month: new Date().toISOString().slice(0, 7) + '-01'
        });
        fetchBudgets();
      }
    } catch (err) {
      console.error('Error creating budget:', err);
    }
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget goal?')) return;
    
    try {
      const token = authService.getToken();
      const res = await fetch(`http://localhost:8080/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchBudgets();
      }
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ok': return 'var(--accent)';
      case 'warn': return 'var(--warn)';
      case 'over': return 'var(--expense)';
      default: return 'var(--accent)';
    }
  };

  const getStatusText = (status, percentage) => {
    if (percentage >= 100) return '⚠ Over budget!';
    if (percentage >= 80) return '⚠ Almost at limit';
    return '✓ On track';
  };

  if (loading) return <div className="loading">Loading...</div>;

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
          <div className="nav-item active">🎯 Budget Goals</div>
          
          <div className="nav-section">Finance</div>
          <div className="nav-item">🏦 Loan Planner</div>
          <div className="nav-item" onClick={() => navigate('/friend-loans')}>🤝 Friend Loans</div>
          
          <div className="sidebar-divider"></div>
          
          <div className="nav-section">Account</div>
          <div className="nav-item">⚙ Settings</div>
          <div className="nav-item" onClick={handleLogout}>⤴ Sign Out</div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.fullName?.substring(0,2).toUpperCase() || 'U'}</div>
            <div>
              <div className="user-name">{user?.fullName || user?.email}</div>
              <div className="user-role">Personal · BHD</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <div className="page-title">Budget Goals</div>
            <div className="page-sub">Monthly spending limits per category</div>
          </div>
          <button className="btn-sm" onClick={() => setShowDrawer(true)}>+ Set Budget</button>
        </div>

        <div className="budget-list">
          {budgets.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px', color: 'var(--muted)'}}>
              <div style={{fontSize: '40px', marginBottom: '16px', opacity: 0.3}}>🎯</div>
              <div style={{fontSize: '13px'}}>No budget goals set yet</div>
              <div style={{fontSize: '11px', marginTop: '8px'}}>Click "Set Budget" to create your first goal</div>
            </div>
          ) : (
            budgets.map(budget => (
              <div key={budget.id} className="budget-item">
                <div className="budget-row">
                  <div className="budget-name">
                    {budget.categoryEmoji} {budget.categoryName}
                  </div>
                  <div className="budget-amounts">
                    BD <strong>{parseFloat(budget.spentAmount).toFixed(3)}</strong> / BD {parseFloat(budget.limitAmount).toFixed(3)}
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${budget.status}`}
                    style={{width: `${Math.min(100, budget.percentageUsed)}%`}}
                  ></div>
                </div>
                <div className="budget-footer">
                  <span>{Math.round(budget.percentageUsed)}% used</span>
                  <span style={{color: getStatusColor(budget.status)}}>
                    {getStatusText(budget.status, budget.percentageUsed)}
                  </span>
                  <button 
                    className="btn-delete-budget"
                    onClick={() => handleDelete(budget.id)}
                    title="Delete budget"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* BUDGET DRAWER */}
      {showDrawer && <div className="drawer-overlay open" onClick={() => setShowDrawer(false)}></div>}
      <div className={`drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-close" onClick={() => setShowDrawer(false)}>✕</div>
        <div className="drawer-title">Set Budget Goal</div>
        <div className="drawer-subtitle">Set a monthly spending limit</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">CATEGORY</label>
            <select 
              className="form-input"
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">MONTHLY LIMIT (BD)</label>
            <input 
              className="form-input" 
              type="number" 
              step="0.001"
              placeholder="100.000"
              value={formData.limitAmount}
              onChange={(e) => setFormData({...formData, limitAmount: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">MONTH</label>
            <input 
              className="form-input" 
              type="month"
              value={formData.month.slice(0, 7)}
              onChange={(e) => setFormData({...formData, month: e.target.value + '-01'})}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Set Budget →</button>
        </form>
      </div>
    </div>
  );
}

export default Budget;
