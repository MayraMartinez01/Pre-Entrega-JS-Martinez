// Función para calcular el valor de las cuotas con interés
function calcularCuotas(monto, cuotas, interes) {
    const tasaMensual = interes / 100 / 12;
    return monto * (tasaMensual / (1 - Math.pow((1 + tasaMensual), -cuotas)));
}

// Función para validar los datos ingresados por el usuario
function validarDatos(monto, cuotas, interes) {
    return monto > 0 && cuotas > 0 && interes >= 0 && monto <= 1000000 && cuotas <= 120;
}

// Función para calcular el pago total y el interés total
function calcularPagoTotal(monto, cuotas, interes) {
    const cuota = calcularCuotas(monto, cuotas, interes);
    const totalPagado = cuota * cuotas;
    const interesTotal = totalPagado - monto;
    return { cuota, totalPagado, interesTotal };
}

// Función para formatear el resultado con la moneda seleccionada
function formatearMoneda(cantidad, moneda) {
    const opciones = { style: 'currency', currency: moneda };
    return new Intl.NumberFormat('es-ES', opciones).format(cantidad);
}

// Función para mostrar el desglose completo
function mostrarDetalles(cuota, totalPagado, interesTotal, moneda) {
    document.getElementById("resultado").innerHTML = `
        <p>Pago mensual: ${formatearMoneda(cuota, moneda)}</p>
        <p>Total pagado: ${formatearMoneda(totalPagado, moneda)}</p>
        <p>Intereses totales: ${formatearMoneda(interesTotal, moneda)}</p>
    `;
}

// Función para calcular el desglose de costos en distintos plazos
function mostrarDesglosePlazos(monto, interes, moneda) {
    const plazos = [12, 24, 36, 48, 60];
    let resultados = '';

    for (const plazo of plazos) {
        const { cuota, totalPagado, interesTotal } = calcularPagoTotal(monto, plazo, interes);
        resultados += `
            <h3>Plazo de ${plazo} meses:</h3>
            <p>Pago mensual: ${formatearMoneda(cuota, moneda)}</p>
            <p>Total pagado: ${formatearMoneda(totalPagado, moneda)}</p>
            <p>Intereses totales: ${formatearMoneda(interesTotal, moneda)}</p>
        `;
    }

    document.getElementById("resultadoPlazos").innerHTML = resultados;
}

// Función para calcular la capacidad de pago
function calcularCapacidadPago() {
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const interes = parseFloat(document.getElementById("interes").value);
    const ingresoMensual = parseFloat(document.getElementById("ingreso").value);
    const moneda = document.getElementById("moneda").value;

    if (!validarDatos(monto, cuotas, interes) || ingresoMensual <= 0) {
        document.getElementById("resultadoCapacidadPago").innerText = "Por favor, ingrese valores válidos para monto, cuotas, interés e ingreso.";
        return;
    }

    const cuotaMensual = calcularCuotas(monto, cuotas, interes);
    const porcentajeMaximo = 0.30;
    const capacidadPago = ingresoMensual * porcentajeMaximo;

    const resultado = cuotaMensual <= capacidadPago ? 
        `Puedes asumir este préstamo. Tu cuota mensual es ${formatearMoneda(cuotaMensual, moneda)}.` :
        `No puedes asumir este préstamo con tu ingreso actual. Tu cuota mensual es ${formatearMoneda(cuotaMensual, moneda)} y excede el límite recomendado.`;

    document.getElementById("resultadoCapacidadPago").innerHTML = resultado;
}

// Función principal para manejar el evento de envío del formulario
function manejarFormulario(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto

    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const interes = parseFloat(document.getElementById("interes").value);
    const moneda = document.getElementById("moneda").value;

    if (validarDatos(monto, cuotas, interes)) {
        const { cuota, totalPagado, interesTotal } = calcularPagoTotal(monto, cuotas, interes);
        mostrarDetalles(cuota, totalPagado, interesTotal, moneda);
        mostrarDesglosePlazos(monto, interes, moneda);
    } else {
        document.getElementById("resultado").innerText = "Por favor, ingrese valores válidos.";
        document.getElementById("resultadoPlazos").innerText = "";
    }
}

// Captura el evento del formulario y vincular la función manejadora
document.getElementById("simulador").addEventListener("submit", manejarFormulario);

// Captura el evento del botón para calcular la capacidad de pago
document.getElementById("calcularCapacidadPago").addEventListener("click", calcularCapacidadPago);
