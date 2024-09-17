// Función para calcular el valor de las cuotas con interés
function calcularCuotas(monto, cuotas, interes) {
    let tasaMensual = interes / 100 / 12;
    let cuota = monto * (tasaMensual / (1 - Math.pow((1 + tasaMensual), -cuotas)));
    return cuota;
}

// Función para validar los datos ingresados por el usuario
function validarDatos(monto, cuotas, interes) {
    return monto > 0 && cuotas > 0 && interes >= 0 && monto <= 1000000 && cuotas <= 120;
}

// Función para calcular el pago total y el interés total
function calcularPagoTotal(monto, cuotas, interes) {
    let cuota = calcularCuotas(monto, cuotas, interes);
    let totalPagado = cuota * cuotas;
    let interesTotal = totalPagado - monto;
    return { cuota, totalPagado, interesTotal };
}

// Función para formatear el resultado con la moneda seleccionada
function formatearMoneda(cantidad, moneda) {
    let opciones = { style: 'currency', currency: moneda };
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
    let plazos = [12, 24, 36, 48, 60];
    let resultados = '';

    plazos.forEach(plazo => {
        let { cuota, totalPagado, interesTotal } = calcularPagoTotal(monto, plazo, interes);
        resultados += `
            <h3>Plazo de ${plazo} meses:</h3>
            <p>Pago mensual: ${formatearMoneda(cuota, moneda)}</p>
            <p>Total pagado: ${formatearMoneda(totalPagado, moneda)}</p>
            <p>Intereses totales: ${formatearMoneda(interesTotal, moneda)}</p>
        `;
    });

    document.getElementById("resultadoPlazos").innerHTML = resultados;
}

// Función para calcular la capacidad de pago
function calcularCapacidadPago() {
    let monto = parseFloat(document.getElementById("monto").value);
    let cuotas = parseInt(document.getElementById("cuotas").value);
    let interes = parseFloat(document.getElementById("interes").value);
    let ingresoMensual = parseFloat(document.getElementById("ingreso").value);

    if (!validarDatos(monto, cuotas, interes) || ingresoMensual <= 0) {
        document.getElementById("resultadoCapacidadPago").innerText = "Por favor, ingrese valores válidos para monto, cuotas, interés e ingreso.";
        return;
    }

    let cuotaMensual = calcularCuotas(monto, cuotas, interes);

    // Suponiendo que no debes destinar más del 30% del ingreso mensual al pago de cuotas
    let porcentajeMaximo = 0.30;
    let capacidadPago = ingresoMensual * porcentajeMaximo;

    let resultado = cuotaMensual <= capacidadPago ? 
        `Puedes asumir este préstamo. Tu cuota mensual es ${formatearMoneda(cuotaMensual, document.getElementById("moneda").value)}.` :
        `No puedes asumir este préstamo con tu ingreso actual. Tu cuota mensual es ${formatearMoneda(cuotaMensual, document.getElementById("moneda").value)} y excede el límite recomendado.`;

    document.getElementById("resultadoCapacidadPago").innerHTML = resultado;
}

// Función principal para manejar el evento de envío del formulario
function manejarFormulario(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto

    // Obtener los valores ingresados por el usuario
    let monto = parseFloat(document.getElementById("monto").value);
    let cuotas = parseInt(document.getElementById("cuotas").value);
    let interes = parseFloat(document.getElementById("interes").value);
    let moneda = document.getElementById("moneda").value;

    // Validar los datos
    if (validarDatos(monto, cuotas, interes)) {
        // Calcular el valor por cuota y el pago total
        let { cuota, totalPagado, interesTotal } = calcularPagoTotal(monto, cuotas, interes);

        // Mostrar el resultado
        mostrarDetalles(cuota, totalPagado, interesTotal, moneda);

        // Mostrar el desglose para diferentes plazos
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
