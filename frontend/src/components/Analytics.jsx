import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './Analytics.css';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyTrends: [],
    spendingByCategory: {},
    incomeByCategory: {},
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    transactionCount: 0
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const token = authService.getToken();
      
      const [statsRes, txRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:8080/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (statsRes.ok && txRes.ok && categoriesRes.ok) {
        const statsData = await statsRes.json();
        const txData = await txRes.json();
        const categoriesData = await categoriesRes.json();
        
        // Calculate income by category
        const incomeByCategory = {};
        txData
          .filter(tx => tx.type === 'INCOME')
          .forEach(tx => {
            if (!incomeByCategory[tx.categoryName]) {
              incomeByCategory[tx.categoryName] = 0;
            }
            incomeByCategory[tx.categoryName] += parseFloat(tx.amount);
          });
        
        setAnalyticsData({
          monthlyTrends: statsData.monthlyTrends || [],
          spendingByCategory: statsData.spendingByCategory || {},
          incomeByCategory,
          totalIncome: parseFloat(statsData.totalIncome || 0),
          totalExpenses: parseFloat(statsData.totalExpenses || 0),
          netSavings: parseFloat(statsData.netSavings || 0),
          transactionCount: statsData.transactionCount || 0
        });
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

  if (loading) return <div className="loading">Loading...</div>;

  // Prepare chart data
  const netBalanceData = analyticsData.monthlyTrends.map(t => 
    parseFloat(t.income) - parseFloat(t.expenses)
  );

  const topSpendingEntries = Object.entries(analyticsData.spendingByCategory)
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
    .slice(0, 5);

  const incomeSourcesEntries = Object.entries(analyticsData.incomeByCategory);

  const avgDailySpend = analyticsData.totalExpenses / 30;
  const biggestExpense = topSpendingEntries.length > 0 ? topSpendingEntries[0][0] : 'N/A';
  const savingsRate = analyticsData.totalIncome > 0 
    ? ((analyticsData.netSavings / analyticsData.totalIncome) * 100).toFixed(1) 
    : 0;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-dot"></div> Cash<span>Wise</span>
        </div>
        <nav className="nav">
          <div className="nav-section">Overview</div>
          <div className="nav-item" onClick={() => navigate('/dashboard')}>▦ Dashboard</div>
          <div className="nav-item active">📊 Analytics</div>
          
          <div className="nav-section">Money</div>
          <div className="nav-item">↕ Transactions</div>
          <div className="nav-item">🏷 Categories</div>
          <div className="nav-item">🎯 Budget Goals</div>
          
          <div className="nav-section">Finance</div>
          <div className="nav-item">🏦 Loan Planner</div>
          <div className="nav-item">🤝 Friend Loans</div>
          
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
            <div className="page-title">Analytics</div>
            <div className="page-sub">Deep insights into your spending habits</div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <div className="chart-title">Monthly Net Trend</div>
            <div style={{height: '220px'}}>
              {analyticsData.monthlyTrends.length > 0 ? (
                <Line 
                  data={{
                    labels: analyticsData.monthlyTrends.map(t => t.month),
                    datasets: [{
                      label: 'Net Balance',
                      data: netBalanceData,
                      borderColor: '#00E5A0',
                      backgroundColor: 'rgba(0,229,160,0.06)',
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: '#00E5A0',
                      pointRadius: 4,
                      pointBorderColor: '#080C10',
                      pointBorderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 },
                          boxWidth: 8
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: 'rgba(30,45,61,0.8)' },
                        ticks: { 
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 }
                        }
                      },
                      y: {
                        grid: { color: 'rgba(30,45,61,0.8)' },
                        ticks: { 
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 },
                          callback: (value) => 'BD ' + value
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '11px'}}>
                  No data available
                </div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-title">Top Spending Categories</div>
            <div style={{height: '220px'}}>
              {topSpendingEntries.length > 0 ? (
                <Bar 
                  data={{
                    labels: topSpendingEntries.map(([name]) => name),
                    datasets: [{
                      data: topSpendingEntries.map(([, amount]) => parseFloat(amount)),
                      backgroundColor: ['#4D9FFF', '#FF4D6A', '#FFB547', '#A78BFA', '#00E5A0'],
                      borderRadius: 5,
                      borderSkipped: false
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      x: {
                        grid: { color: 'rgba(30,45,61,0.8)' },
                        ticks: { 
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 },
                          callback: (value) => 'BD ' + value
                        }
                      },
                      y: {
                        grid: { color: 'rgba(30,45,61,0.8)' },
                        ticks: { 
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '11px'}}>
                  No expense data available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="analytics-bottom">
          <div className="chart-card">
            <div className="chart-title">Key Stats</div>
            <div className="stat-row">
              <span className="stat-row-label">Avg daily spend</span>
              <span className="stat-row-value" style={{color: 'var(--expense)'}}>
                BD {avgDailySpend.toFixed(3)}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Biggest expense</span>
              <span className="stat-row-value">{biggestExpense}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Savings rate</span>
              <span className="stat-row-value" style={{color: 'var(--accent)'}}>
                {savingsRate}%
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Transactions</span>
              <span className="stat-row-value">{analyticsData.transactionCount} this month</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Total Income</span>
              <span className="stat-row-value" style={{color: 'var(--income)'}}>
                BD {analyticsData.totalIncome.toFixed(3)}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Total Expenses</span>
              <span className="stat-row-value" style={{color: 'var(--expense)'}}>
                BD {analyticsData.totalExpenses.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="chart-card income-sources">
            <div className="chart-title">Income Sources</div>
            <div style={{height: '180px'}}>
              {incomeSourcesEntries.length > 0 ? (
                <Doughnut 
                  data={{
                    labels: incomeSourcesEntries.map(([name]) => name),
                    datasets: [{
                      data: incomeSourcesEntries.map(([, amount]) => amount),
                      backgroundColor: ['#00E5A0', '#4D9FFF', '#A78BFA', '#FFB547', '#FF4D6A'],
                      borderColor: '#0F1419',
                      borderWidth: 3,
                      hoverOffset: 6
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '62%',
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: '#5B7A94',
                          font: { family: 'JetBrains Mono', size: 10 },
                          boxWidth: 8,
                          padding: 12
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '11px'}}>
                  No income data available
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;
