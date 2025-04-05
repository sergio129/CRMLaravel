/**
 * Funciones mejoradas para las herramientas de crédito
 */

// Formatea un número como moneda
function formatCurrency(value) {
    // Redondear a 2 decimales
    value = Math.round(value * 100) / 100;
    // Separamos los decimales
    let parts = value.toFixed(2).toString().split('.');
    // Formateamos la parte entera con separadores de miles
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return '$' + parts[0] + '.' + parts[1];
}

// Formatea un número como porcentaje
function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

// Convierte tasa mensual a anual
function monthlyToAnnualRate(monthlyRate) {
    // Fórmula para calcular la tasa anual a partir de la mensual
    return (Math.pow(1 + monthlyRate / 100, 12) - 1) * 100;
}

// Convierte tasa anual a mensual
function annualToMonthlyRate(annualRate) {
    // Fórmula para calcular la tasa mensual a partir de la anual
    return (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100;
}

// Actualiza el mensaje de equivalencia de tasas
function updateRateEquivalence() {
    const rateInput = document.getElementById('interest-rate');
    const rateEquivalenceElement = document.getElementById('rate-equivalence');
    
    if (!rateInput || !rateEquivalenceElement) return;
    
    let monthlyRate = parseFloat(rateInput.value.replace(',', '.'));
    if (isNaN(monthlyRate)) monthlyRate = 0;
    
    const annualRate = monthlyToAnnualRate(monthlyRate);
    rateEquivalenceElement.textContent = `Tasa anual equivalente: ${formatPercentage(annualRate)}`;
    rateEquivalenceElement.style.display = 'block';
}

// Genera tabla de amortización
function generateAmortizationTable(principal, rate, term, payment) {
    const tableElement = document.getElementById('amortization-table');
    if (!tableElement) return;
    
    let balance = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    // Guardamos los datos completos para usarlos en la vista detallada
    let fullAmortizationData = [];
    
    // Calculamos todos los datos de amortización
    for (let i = 1; i <= term; i++) {
        const interest = balance * rate;
        const principal_payment = payment - interest;
        
        totalInterest += interest;
        totalPrincipal += principal_payment;
        
        balance -= principal_payment;
        if (balance < 0.01) balance = 0; // Evitar residuos por redondeo
        
        // Guardamos los datos para cada período
        fullAmortizationData.push({
            period: i,
            payment: payment,
            principal: principal_payment,
            interest: interest,
            balance: balance
        });
    }
    
    // Crear encabezado de tabla con clases para alineación
    let tableHTML = `
        <thead>
            <tr>
                <th class="column-period">Cuota</th>
                <th class="column-payment">Pago</th>
                <th class="column-principal">Capital</th>
                <th class="column-interest">Interés</th>
                <th class="column-balance">Saldo</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    // Añadir filas para cada período
    for (let i = 1; i <= term; i++) {
        const interest = balance * rate;
        const principal_payment = payment - interest;
        
        balance -= principal_payment;
        if (balance < 0.01) balance = 0; // Evitar residuos por redondeo
        
        // Solo mostrar primeras 3 filas y últimas 2 si son muchas
        if (term > 10 && i > 3 && i < term - 1) {
            if (i === 4) {
                tableHTML += `
                    <tr>
                        <td colspan="5" class="ellipsis-row">...</td>
                    </tr>
                `;
            }
            continue;
        }
        
        tableHTML += `
            <tr>
                <td class="column-period">${i}</td>
                <td class="column-payment">${formatCurrency(payment)}</td>
                <td class="column-principal">${formatCurrency(principal_payment)}</td>
                <td class="column-interest">${formatCurrency(interest)}</td>
                <td class="column-balance">${formatCurrency(balance)}</td>
            </tr>
        `;
    }
    
    // Añadir fila de totales
    tableHTML += `
        <tr class="total-row">
            <td class="column-period">Total</td>
            <td class="column-payment">${formatCurrency(payment * term)}</td>
            <td class="column-principal">${formatCurrency(totalPrincipal)}</td>
            <td class="column-interest">${formatCurrency(totalInterest)}</td>
            <td class="column-balance">-</td>
        </tr>
    `;
    
    tableHTML += '</tbody>';
    tableElement.innerHTML = tableHTML;
    
    // Guardar los datos en una variable global para acceder desde el botón
    window.amortizationTableData = {
        data: fullAmortizationData,
        payment: payment,
        totalPrincipal: totalPrincipal,
        totalInterest: totalInterest,
        term: term
    };
    
    // Configurar el botón para ver la tabla completa
    const viewButton = document.getElementById('btn-view-full-amortization');
    if (viewButton) {
        // Limpiar cualquier evento anterior
        const newButton = viewButton.cloneNode(true);
        if (viewButton.parentNode) {
            viewButton.parentNode.replaceChild(newButton, viewButton);
        }
        
        // Añadir nuevo evento
        newButton.addEventListener('click', function() {
            showFullAmortizationTable(
                window.amortizationTableData.data,
                window.amortizationTableData.payment,
                window.amortizationTableData.totalPrincipal,
                window.amortizationTableData.totalInterest,
                window.amortizationTableData.term
            );
        });
    }
}

// Mostrar tabla completa de amortización
function showFullAmortizationTable(data, payment, totalPrincipal, totalInterest, term) {
    console.log("Showing full amortization table...");
    
    // Verificar si ya existe un contenedor y eliminarlo
    let container = document.getElementById('full-amortization-container');
    if (container) {
        container.remove();
    }
    
    // Crear el contenedor
    container = document.createElement('div');
    container.id = 'full-amortization-container';
    container.className = 'full-amortization-container';
    
    // Crear el contenido de la ventana modal con clases específicas para el ancho de columna
    container.innerHTML = `
        <div class="full-amortization-content">
            <div class="full-amortization-header">
                <h3>Tabla de Amortización Completa (${term} cuotas)</h3>
                <button class="full-amortization-close">&times;</button>
            </div>
            <div class="full-amortization-body">
                <table class="amortization-table">
                    <thead>
                        <tr>
                            <th>Cuota</th>
                            <th>Pago</th>
                            <th>Capital</th>
                            <th>Interés</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.period}</td>
                                <td>${formatCurrency(item.payment)}</td>
                                <td>${formatCurrency(item.principal)}</td>
                                <td>${formatCurrency(item.interest)}</td>
                                <td>${formatCurrency(item.balance)}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>Total</td>
                            <td>${formatCurrency(payment * term)}</td>
                            <td>${formatCurrency(totalPrincipal)}</td>
                            <td>${formatCurrency(totalInterest)}</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Añadir el contenedor al cuerpo del documento
    document.body.appendChild(container);
    
    // Mostrar la ventana modal con una pequeña demora para permitir la transición
    setTimeout(() => {
        container.classList.add('active');
    }, 10);
    
    // Manejar el cierre de la ventana modal
    const closeButton = container.querySelector('.full-amortization-close');
    closeButton.addEventListener('click', function() {
        container.classList.remove('active');
        setTimeout(() => {
            container.remove();
        }, 300);
    });
    
    // Cerrar también al hacer clic fuera del contenido
    container.addEventListener('click', function(e) {
        if (e.target === container) {
            container.classList.remove('active');
            setTimeout(() => {
                container.remove();
            }, 300);
        }
    });
}

// Cálculo detallado del préstamo
function calculateDetailedLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    let rateInput = document.getElementById('interest-rate').value;
    // Reemplazar coma por punto para el cálculo
    rateInput = rateInput.replace(',', '.');
    const rateMonthly = parseFloat(rateInput); // Ahora es directamente mensual
    const term = parseInt(document.getElementById('loan-term').value);
    
    // La tasa ya está en mensual, no es necesario convertirla
    const rateDecimal = rateMonthly / 100;
    
    let monthlyPayment, totalPayment, totalInterest;
    
    if (rateDecimal === 0) {
        // Si la tasa es 0, es un cálculo simple
        monthlyPayment = amount / term;
        totalPayment = amount;
        totalInterest = 0;
    } else {
        // Fórmula estándar de amortización
        const x = Math.pow(1 + rateDecimal, term);
        monthlyPayment = (amount * x * rateDecimal) / (x - 1);
        totalPayment = monthlyPayment * term;
        totalInterest = totalPayment - amount;
    }
    
    // Mostrar resultados con formato mejorado
    document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
    
    // Si existen los elementos para el detalle, los actualizamos
    const paymentDetailElement = document.getElementById('monthly-payment-detail');
    if (paymentDetailElement) {
        // Para el primer mes, calculamos el interés y el capital
        const firstMonthInterest = amount * rateDecimal;
        const firstMonthCapital = monthlyPayment - firstMonthInterest;
        
        paymentDetailElement.textContent = `Capital inicial: ${formatCurrency(firstMonthCapital)} + Interés: ${formatCurrency(firstMonthInterest)}`;
    }
    
    document.getElementById('total-payment').textContent = formatCurrency(totalPayment);
    
    const paymentDetailTotalElement = document.getElementById('total-payment-detail');
    if (paymentDetailTotalElement) {
        paymentDetailTotalElement.textContent = `${term} cuotas de ${formatCurrency(monthlyPayment)}`;
    }
    
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    
    const interestDetailElement = document.getElementById('total-interest-detail');
    if (interestDetailElement) {
        const effectiveAnnualRate = monthlyToAnnualRate(rateMonthly);
        interestDetailElement.textContent = `Tasa efectiva anual: ${formatPercentage(effectiveAnnualRate)}`;
    }
    
    // Generar tabla de amortización
    generateAmortizationTable(amount, rateDecimal, term, monthlyPayment);
    
    return false; // Prevenir envío del formulario
}

// Cuando el DOM esté cargado, inicializar los eventos
document.addEventListener('DOMContentLoaded', function() {
    // Reemplazar el evento del formulario de préstamo
    const loanCalculatorForm = document.getElementById('loan-calculator');
    if (loanCalculatorForm) {
        loanCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateDetailedLoan();
        });
    }
    
    // Manejar cambio en la tasa de interés para mostrar equivalencia
    const interestRateInput = document.getElementById('interest-rate');
    if (interestRateInput) {
        interestRateInput.addEventListener('input', function() {
            updateRateEquivalence();
        });
        // Inicializar el mensaje de equivalencia
        updateRateEquivalence();
    }
    
    // Inicializar tabla al cargar la página
    const loanAmountInput = document.getElementById('loan-amount');
    const loanTermInput = document.getElementById('loan-term');
    
    if (interestRateInput && loanAmountInput && loanTermInput) {
        calculateDetailedLoan();
    }
    
    // También inicializar el botón de ver tabla completa
    const viewButton = document.getElementById('btn-view-full-amortization');
    if (viewButton && window.amortizationTableData) {
        viewButton.addEventListener('click', function() {
            showFullAmortizationTable(
                window.amortizationTableData.data,
                window.amortizationTableData.payment,
                window.amortizationTableData.totalPrincipal,
                window.amortizationTableData.totalInterest,
                window.amortizationTableData.term
            );
        });
    }
});
