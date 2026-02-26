import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useCurrency } from '../context/CurrencyContext';
import './FriendLoans.css';

function FriendLoans() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { currency } = useCurrency();
  const [loans, setLoans] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loanType, setLoanType] = useState('LENT');
  const [formData, setFormData] = useState({
    friendName: '',
    amount: '',
    note: '',
    loanDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/friend-loans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
        const pending = data.filter(l => l.status === 'PENDING').length;
        setPendingCount(pending);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/friend-loans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: loanType,
          amount: parseFloat(formData.amount)
        })
      });
      
      if (res.ok) {
        setShowDrawer(false);
        setFormData({
          friendName: '',
          amount: '',
          note: '',
          loanDate: new Date().toISOString().split('T')[0]
        });
        fetchLoans();
      }
    } catch (err) {
      console.error('Error creating loan:', err);
    }
  };

  const handleSettle = async (loanId) => {
    try {
      const token = authService.getToken();
      const res = await fetch(`http://localhost:8080/api/friend-loans/${loanId}/settle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchLoans();
      }
    } catch (err) {
      console.error('Error settling loan:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const lentLoans = loans.filter(l => l.type === 'LENT');
  const borrowedLoans = loans.filter(l => l.type === 'BORROWED');
  
  const totalLent = lentLoans.filter(l => l.status === 'PENDING')
    .reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const totalBorrowed = borrowedLoans.filter(l => l.status === 'PENDING')
    .reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const netPosition = totalLent - totalBorrowed;

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
          <div className="nav-item" onClick={() => navigate('/budget')}>🎯 Budget Goals</div>
          
          <div className="nav-section">Finance</div>
          <div className="nav-item" onClick={() => navigate('/loan-planner')}>🏦 Loan Planner</div>
          <div className="nav-item active">
            🤝 Friend Loans
            {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
          </div>
          
          <div className="sidebar-divider"></div>
          
          <div className="nav-section">Account</div>
          <div className="nav-item" onClick={() => navigate('/settings')}>⚙ Settings</div>
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
            <div className="page-title">Friend Loans</div>
            <div className="page-sub">Track money you've lent or borrowed</div>
          </div>
          <div className="header-actions">
            <button className="btn-sm" onClick={() => setShowDrawer(true)}>+ Add Entry</button>
          </div>
        </div>

        <div className="fl-summary">
          <div className="stat-card warn-card">
            <div className="stat-label">YOU LENT</div>
            <div className="stat-value">{currency} {totalLent.toFixed(3)}</div>
            <div className="stat-change">{lentLoans.filter(l => l.status === 'PENDING').length} pending</div>
          </div>
          
          <div className="stat-card info-card">
            <div className="stat-label">YOU BORROWED</div>
            <div className="stat-value">{currency} {totalBorrowed.toFixed(3)}</div>
            <div className="stat-change">{borrowedLoans.filter(l => l.status === 'PENDING').length} pending</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-label">NET POSITION</div>
            <div className="stat-value" style={{color: netPosition >= 0 ? 'var(--income)' : 'var(--expense)'}}>
              {netPosition >= 0 ? '+' : ''}{currency} {netPosition.toFixed(3)}
            </div>
            <div className="stat-change">From {loans.length} entries</div>
          </div>
        </div>

        <div className="friends-layout">
          {loans.map(loan => (
            <div key={loan.id} className="friend-card">
              <div className={`friend-avatar ${loan.type.toLowerCase()}`}>
                {loan.friendName.substring(0, 2).toUpperCase()}
              </div>
              <div className="friend-info">
                <div className="friend-name">{loan.friendName}</div>
                <div className="friend-note">{loan.note}</div>
                <div className="friend-date">{loan.loanDate}</div>
              </div>
              <div>
                <div className={`friend-amount ${loan.type.toLowerCase()}`}>
                  {currency} {loan.amount.toFixed(3)}
                </div>
                {loan.status === 'PENDING' ? (
                  <button className="pay-btn" onClick={() => handleSettle(loan.id)}>
                    Settle
                  </button>
                ) : (
                  <span className="status-tag settled">Settled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ADD LOAN DRAWER */}
      {showDrawer && <div className="drawer-overlay open" onClick={() => setShowDrawer(false)}></div>}
      <div className={`drawer ${showDrawer ? 'open' : ''}`}>
        <div className="drawer-close" onClick={() => setShowDrawer(false)}>✕</div>
        <div className="drawer-title">Add Friend Loan</div>
        <div className="drawer-subtitle">Track money lent or borrowed</div>

        <form onSubmit={handleSubmitLoan}>
          <div className="type-toggle">
            <div 
              className={`type-btn lent ${loanType === 'LENT' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setLoanType('LENT'); }}
            >
              You Lent
            </div>
            <div 
              className={`type-btn borrowed ${loanType === 'BORROWED' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setLoanType('BORROWED'); }}
            >
              You Borrowed
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">FRIEND NAME</label>
            <input 
              className="form-input" 
              type="text"
              placeholder="e.g. Ahmed Ali"
              value={formData.friendName}
              onChange={(e) => setFormData({...formData, friendName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">AMOUNT ({currency})</label>
            <input 
              className="form-input" 
              type="number" 
              step="0.001"
              placeholder="0.000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">NOTE</label>
            <textarea 
              className="form-input"
              placeholder="e.g. For emergency expenses"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">DATE</label>
            <input 
              className="form-input" 
              type="date"
              value={formData.loanDate}
              onChange={(e) => setFormData({...formData, loanDate: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Save Entry →</button>
        </form>
      </div>
    </div>
  );
}

export default FriendLoans;
