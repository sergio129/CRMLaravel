import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Ingresos vs Egresos</h5>
            </div>
            <div className="card-body">
              {stats && stats.incomeVsExpenses && (
                <Bar 
                  data={stats.incomeVsExpenses}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Comparación de Ingresos y Egresos'
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title">Estado de Créditos</h5>
            </div>
            <div className="card-body">
              {stats && stats.creditStatus && (
                <Pie 
                  data={stats.creditStatus}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Flujo de Caja</h5>
            </div>
            <div className="card-body">
              {stats && stats.cashFlow && (
                <Line 
                  data={stats.cashFlow}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
