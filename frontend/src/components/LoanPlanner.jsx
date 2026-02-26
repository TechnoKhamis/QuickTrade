import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import authService from '../services/authService';
import './LoanPlanner.css';

function LoanPlanner() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    loanName: '',
    principal: '',
    rate: '',
    term: ''
  });
  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState({
    totalInterest: 0,
    totalPayment: 0,
    monthlyPayment: 0
  });

  const calculateLoan = (e) => {
    e.preventDefault();
    
    const P = parseFloat(formData.principal);
    const annualRate = parseFloat(formData.rate);
    const months = parseInt(formData.term);
    
    // Monthly interest rate
    const r = annualRate / 100 / 12;
    
    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = P * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    
    let balance = P;
    const scheduleData = [];
    let totalInterest = 0;
    
    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;
      
      scheduleData.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }
    
    setSchedule(scheduleData);
    setSummary({
      monthlyPayment,
      totalInterest,
      totalPayment: P + totalInterest
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
          <div className="nav-item active">🏦 Loan Planner</div>
          <div className="nav-item" onClick={() => navigate('/friend-loans')}>🤝 Friend Loans</div>
          
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
            <div className="page-title">Loan Planner</div>
            <div className="page-sub">Calculate payments & view amortization</div>
          </div>
        </div>

        <div className="loan-layout">
          <div className="loan-form-card">
            <div className="loan-form-title">New Loan</div>
            
            <form onSubmit={calculateLoan}>
              <div className="form-group">
                <label className="form-label">LOAN NAME</label>
                <input 
                  className="form-input" 
                  type="text"
                  placeholder="e.g. Car Loan"
                  value={formData.loanName}
                  onChange={(e) => setFormData({...formData, loanName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PRINCIPAL ({currency})</label>
                <input 
                  className="form-input" 
                  type="number"
                  step="0.001"
                  placeholder="10000.000"
                  value={formData.principal}
                  onChange={(e) => setFormData({...formData, principal: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">INTEREST RATE (%)</label>
                <input 
                  className="form-input" 
                  type="number"
                  step="0.01"
                  placeholder="5.5"
                  value={formData.rate}
                  onChange={(e) => setFormData({...formData, rate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">TERM (MONTHS)</label>
                <input 
                  className="form-input" 
                  type="number"
                  placeholder="36"
                  value={formData.term}
                  onChange={(e) => setFormData({...formData, term: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">Calculate →</button>
            </form>

            {summary.monthlyPayment > 0 && (
              <div className="loan-summary">
                <div className="summary-title">PAYMENT SUMMARY</div>
                <div className="summary-row">
                  <span>Monthly Payment</span>
                  <span className="summary-value">{currency} {summary.monthlyPayment.toFixed(3)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Interest</span>
                  <span className="summary-value interest">{currency} {summary.totalInterest.toFixed(3)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Payment</span>
                  <span className="summary-value">{currency} {summary.totalPayment.toFixed(3)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="loan-schedule-card">
            <div className="schedule-title">Amortization Schedule</div>
            
            {schedule.length > 0 ? (
              <div className="schedule-table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>PAYMENT</th>
                      <th>PRINCIPAL</th>
                      <th>INTEREST</th>
                      <th>BALANCE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{currency} {row.payment.toFixed(3)}</td>
                        <td className="principal-col">{currency} {row.principal.toFixed(3)}</td>
                        <td className="interest-col">{currency} {row.interest.toFixed(3)}</td>
                        <td>{currency} {row.balance.toFixed(3)}</td>
                        <td>
                          <button className="pay-btn-small">Pay</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-schedule">
                <div className="empty-icon">📊</div>
                <div className="empty-text">Enter loan details to see amortization schedule</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoanPlanner;
