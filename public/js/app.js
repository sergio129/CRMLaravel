// Funciones de autenticación
function checkAuthentication() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Si no hay token, redirigir al login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
        }
        return false;
    }
    
    // Verificar si el token es válido
    return fetch('/api/check-auth', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            // Si el token no es válido, eliminar y redirigir
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('Error checking authentication:', error);
    });
}

// Ejecutar verificación de autenticación en cada carga de página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // Manejar el cierre de sesión
    const logoutForm = document.getElementById('logout-form');
    if (logoutForm) {
        logoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Error during logout:', error);
                localStorage.removeItem('token');
                window.location.href = '/login';
            });
        });
    }
});

// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
}

// Funciones para manejo de errores
function showErrorMessage(message, elementId = 'alert-container') {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    } else {
        console.error(message);
    }
}

function showSuccessMessage(message, elementId = 'alert-container') {
    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    } else {
        console.log(message);
    }
}

// Función para manejar peticiones a la API
function apiRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    // Configurar headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Authorization': token ? `Bearer ${token}` : ''
    };
    
    // Mezclar con las opciones proporcionadas
    const requestOptions = {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    };
    
    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                // Si es error 401, redirigir al login
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }
                return response.json().then(data => {
                    throw new Error(data.message || 'Error en la petición');
                });
            }
            return response.json();
        });
}
