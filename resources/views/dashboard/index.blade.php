@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3 mb-4">
                            <div class="card text-white bg-primary">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h5 class="card-title">Ingresos</h5>
                                            <h2 id="total-ingresos">$0.00</h2>
                                        </div>
                                        <div>
                                            <i class="fas fa-money-bill-wave fa-3x"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0">
                                    <a href="/ingresos" class="text-white">Ver detalles <i class="fas fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3 mb-4">
                            <div class="card text-white bg-danger">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h5 class="card-title">Egresos</h5>
                                            <h2 id="total-egresos">$0.00</h2>
                                        </div>
                                        <div>
                                            <i class="fas fa-receipt fa-3x"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0">
                                    <a href="/egresos" class="text-white">Ver detalles <i class="fas fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3 mb-4">
                            <div class="card text-white bg-success">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h5 class="card-title">Créditos Activos</h5>
                                            <h2 id="total-creditos">0</h2>
                                        </div>
                                        <div>
                                            <i class="fas fa-credit-card fa-3x"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0">
                                    <a href="/creditos" class="text-white">Ver detalles <i class="fas fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-3 mb-4">
                            <div class="card text-white bg-warning">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <h5 class="card-title">Clientes en Mora</h5>
                                            <h2 id="total-mora">0</h2>
                                        </div>
                                        <div>
                                            <i class="fas fa-exclamation-triangle fa-3x"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent border-top-0">
                                    <a href="/creditos/mora" class="text-white">Ver detalles <i class="fas fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-header">
                                    Movimientos Financieros (Últimos 6 meses)
                                </div>
                                <div class="card-body">
                                    <canvas id="financeChart" height="300"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">
                                    Distribución de Créditos
                                </div>
                                <div class="card-body">
                                    <canvas id="creditDistributionChart" height="300"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <span>Últimos Pagos Recibidos</span>
                                    <a href="/creditos/pagos" class="btn btn-sm btn-primary">Ver Todos</a>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="pagos-table">
                                            <thead>
                                                <tr>
                                                    <th>Cliente</th>
                                                    <th>Crédito</th>
                                                    <th>Fecha</th>
                                                    <th>Monto</th>
                                                    <th>Estatus</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Se llenará dinámicamente con JavaScript -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del dashboard
    fetch('/api/dashboard/stats', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Actualizar tarjetas informativas
            document.getElementById('total-ingresos').textContent = '$' + data.data.ingresos.toFixed(2);
            document.getElementById('total-egresos').textContent = '$' + data.data.egresos.toFixed(2);
            document.getElementById('total-creditos').textContent = data.data.creditos_activos;
            document.getElementById('total-mora').textContent = data.data.clientes_mora;
            
            // Crear gráficos
            createFinanceChart(data.data.chart_data);
            createCreditDistributionChart(data.data.credit_distribution);
            
            // Llenar tabla de pagos recientes
            fillRecentPaymentsTable(data.data.recent_payments);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    function createFinanceChart(data) {
        const ctx = document.getElementById('financeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: data.ingresos,
                        borderColor: 'rgba(40, 167, 69, 1)',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Egresos',
                        data: data.egresos,
                        borderColor: 'rgba(220, 53, 69, 1)',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function createCreditDistributionChart(data) {
        const ctx = document.getElementById('creditDistributionChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.7)',
                        'rgba(0, 123, 255, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(220, 53, 69, 0.7)',
                        'rgba(111, 66, 193, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + '%';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function fillRecentPaymentsTable(payments) {
        const tableBody = document.querySelector('#pagos-table tbody');
        tableBody.innerHTML = '';
        
        payments.forEach(payment => {
            const row = document.createElement('tr');
            
            const clientCell = document.createElement('td');
            clientCell.textContent = payment.cliente;
            row.appendChild(clientCell);
            
            const creditCell = document.createElement('td');
            creditCell.textContent = payment.credito_id;
            row.appendChild(creditCell);
            
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(payment.fecha).toLocaleDateString();
            row.appendChild(dateCell);
            
            const amountCell = document.createElement('td');
            amountCell.textContent = '$' + payment.monto.toFixed(2);
            row.appendChild(amountCell);
            
            const statusCell = document.createElement('td');
            const statusBadge = document.createElement('span');
            statusBadge.className = `badge bg-${payment.estatus === 'Pagado' ? 'success' : 'warning'}`;
            statusBadge.textContent = payment.estatus;
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            tableBody.appendChild(row);
        });
    }
});
</script>
@endsection
