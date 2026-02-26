import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useCurrency } from '../context/CurrencyContext';
import './Categories.css';

function Categories() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { currency } = useCurrency();
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    emoji: '',
    type: 'EXPENSE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = authService.getToken();
      
      const [catRes, txRes] = await Promise.all([
        fetch('http://localhost:8080/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (catRes.ok && txRes.ok) {
        const catData = await catRes.json();
        const txData = await txRes.json();
        
        setCategories(catData);
        setTransactions(txData);
        
        // Calculate stats per category
        const stats = {};
        catData.forEach(cat => {
          const catTransactions = txData.filter(tx => tx.categoryName === cat.name);
          const total = catTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
          stats[cat.id] = {
            count: catTransactions.length,
            total: total
          };
        });
        setCategoryStats(stats);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });
      
      if (res.ok) {
        setShowModal(false);
        setNewCategory({ name: '', emoji: '', type: 'EXPENSE' });
        fetchData();
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
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
          <div className="nav-item active">🏷 Categories</div>
          <div className="nav-item" onClick={() => navigate('/budget')}>🎯 Budget Goals</div>
          
          <div className="nav-section">Finance</div>
          <div className="nav-item" onClick={() => navigate('/loan-planner')}>🏦 Loan Planner</div>
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
            <div className="page-title">Categories</div>
            <div className="page-sub">Manage your spending categories</div>
          </div>
          <div className="header-actions">
            <button className="btn-sm" onClick={() => setShowModal(true)}>+ New Category</button>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map(cat => {
            const stats = categoryStats[cat.id] || { count: 0, total: 0 };
            return (
              <div key={cat.id} className="cat-card">
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{stats.count} transactions</div>
                  <div className={`cat-total ${cat.type.toLowerCase()}`}>
                    {cat.type === 'INCOME' ? '+' : '-'}{currency} {stats.total.toFixed(3)}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="add-cat-card" onClick={() => setShowModal(true)}>
            <span style={{fontSize: '20px'}}>+</span>
            <span>New Category</span>
          </div>
        </div>
      </main>

      {/* ADD CATEGORY MODAL */}
      {showModal && (
        <>
          <div className="modal-overlay open" onClick={() => setShowModal(false)}></div>
          <div className="modal open">
            <div className="modal-close" onClick={() => setShowModal(false)}>✕</div>
            <div className="modal-title">New Category</div>
            <div className="modal-sub">Create a custom spending category</div>

            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label className="form-label">CATEGORY NAME</label>
                <input 
                  className="form-input" 
                  type="text"
                  placeholder="e.g. Gym Membership"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMOJI</label>
                <input 
                  className="form-input" 
                  type="text"
                  placeholder="🏋️"
                  maxLength="2"
                  value={newCategory.emoji}
                  onChange={(e) => setNewCategory({...newCategory, emoji: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">TYPE</label>
                <select 
                  className="form-input"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
                  required
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">Create Category →</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Categories;
