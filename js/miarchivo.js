// Capturamos los elementos del DOM
const formulario = document.getElementById('simulador');
const resultado = document.getElementById('resultado');
const resultadoPlazos = document.getElementById('resultadoPlazos');
const resultadoCapacidadPago = document.getElementById('resultadoCapacidadPago');
const botonCapacidadPago = document.getElementById('calcularCapacidadPago');

// Función para calcular el monto total del préstamo (cuota mensual)
function calcularPrestamo(monto, cuotas, interes) {
    const tasaMensual = interes / 100 / 12;
    return monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -cuotas));
}

// Función para calcular la capacidad de pago (30% del ingreso mensual)
function capacidadDePago(ingresoMensual, cuotaMensual) {
    const porcentajeMaximo = 0.3; // 30% del ingreso mensual
    return ingresoMensual * porcentajeMaximo >= cuotaMensual;
}

// Función para mostrar la tabla de amortización (ciclo con for)
function mostrarAmortizacion(monto, cuotas, interes) {
    const tasaMensual = interes / 100 / 12;
    let saldo = monto;
    let tablaAmortizacion = `
        <table>
            <thead>
                <tr>
                    <th>N° Cuota</th>
                    <th>Cuota Mensual ($)</th>
                    <th>Interés Pagado ($)</th>
                    <th>Capital Pagado ($)</th>
                    <th>Saldo Restante ($)</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 1; i <= cuotas; i++) {
        const interesCuota = saldo * tasaMensual;
        const cuotaMensual = calcularPrestamo(saldo, cuotas - i + 1, interes);
        const capitalPagado = cuotaMensual - interesCuota;
        saldo -= capitalPagado;

        // Añadir fila a la tabla
        tablaAmortizacion += `
            <tr>
                <td>${i}</td>
                <td>${cuotaMensual.toFixed(2)}</td>
                <td>${interesCuota.toFixed(2)}</td>
                <td>${capitalPagado.toFixed(2)}</td>
                <td>${saldo.toFixed(2)}</td>
            </tr>
        `;
    }

    tablaAmortizacion += `</tbody></table>`;

    return tablaAmortizacion;
}

// Evento submit del formulario para el cálculo del préstamo
formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('monto').value);
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const interes = parseFloat(document.getElementById('interes').value);

    // Validación de entradas
    if (isNaN(monto) || isNaN(cuotas) || isNaN(interes) || monto < 0 || cuotas <= 0 || interes < 0) {
        resultado.textContent = 'Por favor, ingrese valores válidos (no negativos).';
        return;
    }

    // Llamada a la función para calcular el préstamo
    const cuotaMensual = calcularPrestamo(monto, cuotas, interes).toFixed(2);
    resultado.textContent = `El valor de cada cuota es: $${cuotaMensual}`;

    // Llamada a la función para mostrar la tabla de amortización
    const amortizacion = mostrarAmortizacion(monto, cuotas, interes);
    resultadoPlazos.innerHTML = amortizacion; // Usamos innerHTML para que se interprete como tabla
});

// Evento para calcular la capacidad de pago
botonCapacidadPago.addEventListener('click', function() {
    const monto = parseFloat(document.getElementById('monto').value);
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const interes = parseFloat(document.getElementById('interes').value);
    const ingreso = parseFloat(document.getElementById('ingreso').value);

    // Validación de entradas
    if (isNaN(monto) || isNaN(cuotas) || isNaN(interes) || isNaN(ingreso) || monto < 0 || cuotas <= 0 || interes < 0 || ingreso < 0) {
        resultadoCapacidadPago.textContent = 'Por favor, ingrese valores válidos (no negativos).';
        return;
    }

    // Calcular la cuota mensual
    const cuotaMensual = calcularPrestamo(monto, cuotas, interes);

    // Verificar si el usuario puede afrontar el pago del préstamo
    if (capacidadDePago(ingreso, cuotaMensual)) {
        resultadoCapacidadPago.textContent = 'Puedes afrontar el pago del préstamo.';
        resultadoCapacidadPago.classList.add('exito');
        resultadoCapacidadPago.classList.remove('error');
    } else {
        resultadoCapacidadPago.textContent = 'No puedes afrontar el pago del préstamo.';
        resultadoCapacidadPago.classList.add('error');
        resultadoCapacidadPago.classList.remove('exito');
    }
});
