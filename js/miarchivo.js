// Sección de variables globales y configuración
const plazosPredefinidos = [12, 24, 36, 48, 60]; // Plazos predefinidos para los cálculos de plazo
const porcentajeMaximo = 0.30; // Límite recomendado del 30% de capacidad de pago

// Tipos de cambio (ejemplos, actualiza según sea necesario)
const tiposCambio = {
    "UYU": 1,   // Pesos uruguayos
    "USD": 40,  // Dólares a pesos uruguayos
    "EUR": 45   // Euros a pesos uruguayos
};

// Función principal para calcular el valor de las cuotas con interés compuesto
function calcularCuotas(monto, cuotas, interes) {
    const tasaMensual = interes / 100 / 12; // Conversión del interés anual a tasa mensual
    return monto * (tasaMensual / (1 - Math.pow((1 + tasaMensual), -cuotas)));
}

// Validación de datos ingresados: monto, cuotas e interés dentro de rangos permitidos
function validarDatos(monto, cuotas, interes) {
    return monto > 0 && cuotas > 0 && interes >= 0 && monto <= 1000000 && cuotas <= 120; // Validaciones de monto y cuotas
}

// Calcular el pago total y el interés total a lo largo del préstamo
function calcularPagoTotal(monto, cuotas, interes) {
    const cuota = calcularCuotas(monto, cuotas, interes);
    const totalPagado = cuota * cuotas;
    const interesTotal = totalPagado - monto; // Intereses totales generados
    return { cuota, totalPagado, interesTotal }; // Retorno en un objeto
}

// Formatear las cantidades con la moneda seleccionada
function formatearMoneda(cantidad, moneda) {
    const opciones = { style: 'currency', currency: moneda };
    return new Intl.NumberFormat('es-UY', opciones).format(cantidad);
}

// Mostrar resultados en el área de detalles del HTML
function mostrarDetalles(cuota, totalPagado, interesTotal, moneda) {
    document.getElementById("resultado").innerHTML = `
        <p>Pago mensual: ${formatearMoneda(cuota, moneda)}</p>
        <p>Total pagado: ${formatearMoneda(totalPagado, moneda)}</p>
        <p>Intereses totales: ${formatearMoneda(interesTotal, moneda)}</p>
    `;
}

// Mostrar desglose para diferentes plazos usando bucle for
function mostrarDesglosePlazos(monto, interes, moneda) {
    let resultados = ''; // Almacenar los resultados en una cadena
    for (let plazo of plazosPredefinidos) {
        const { cuota, totalPagado, interesTotal } = calcularPagoTotal(monto, plazo, interes);
        resultados += `
            <h3>Plazo de ${plazo} meses:</h3>
            <p>Pago mensual: ${formatearMoneda(cuota, moneda)}</p>
            <p>Total pagado: ${formatearMoneda(totalPagado, moneda)}</p>
            <p>Intereses totales: ${formatearMoneda(interesTotal, moneda)}</p>
        `;
        console.log(`Plazo de ${plazo} meses: Pago mensual: ${formatearMoneda(cuota, moneda)}, Total pagado: ${formatearMoneda(totalPagado, moneda)}, Intereses totales: ${formatearMoneda(interesTotal, moneda)}`);
    }
    document.getElementById("resultadoPlazos").innerHTML = resultados;
}

// Calcular la capacidad de pago según el ingreso mensual y la cuota máxima permitida
function calcularCapacidadPago() {
    // Capturar valores ingresados por el usuario
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const interes = parseFloat(document.getElementById("interes").value);
    const ingresoMensual = parseFloat(document.getElementById("ingreso").value);
    const moneda = document.getElementById("moneda").value;

    // Validar los datos antes de calcular la capacidad de pago
    if (!validarDatos(monto, cuotas, interes) || ingresoMensual <= 0) {
        document.getElementById("resultadoCapacidadPago").innerText = "Por favor, ingrese valores válidos para monto, cuotas, interés e ingreso.";
        alert("Por favor, ingrese valores válidos para monto, cuotas, interés e ingreso.");
        return;
    }

    // Convertir el monto a pesos uruguayos según el tipo de cambio
    const montoEnPesos = monto * tiposCambio[moneda];

    // Calcular la cuota mensual y la capacidad de pago máxima
    const cuotaMensual = calcularCuotas(montoEnPesos, cuotas, interes);
    const capacidadPago = ingresoMensual * porcentajeMaximo;

    // Determinar si el usuario puede asumir el préstamo
    const resultado = cuotaMensual <= capacidadPago ? 
        `Puedes asumir este préstamo. Tu cuota mensual es ${formatearMoneda(cuotaMensual, moneda)}.` :
        `No puedes asumir este préstamo con tu ingreso actual. Tu cuota mensual es ${formatearMoneda(cuotaMensual, moneda)} y excede el límite recomendado.`;

    document.getElementById("resultadoCapacidadPago").innerHTML = resultado;
}

// Obtener tipo de cambio usando switch
function obtenerTipoCambio(moneda) {
    switch (moneda) {
        case "UYU":
            return 1;
        case "USD":
            return 40;
        case "EUR":
            return 45;
        default:
            throw new Error("Moneda no válida");
    }
}

// Capturar datos usando prompt() y solo mostrar errores si son inválidos
function capturarDatosPrompt() {
    const montoPrompt = parseFloat(prompt("Ingrese el monto del préstamo:"));
    const cuotasPrompt = parseInt(prompt("Ingrese el número de cuotas:"));
    const interesPrompt = parseFloat(prompt("Ingrese la tasa de interés anual:"));
    
    // Validar los datos ingresados
    if (validarDatos(montoPrompt, cuotasPrompt, interesPrompt)) {
        const { cuota, totalPagado, interesTotal } = calcularPagoTotal(montoPrompt, cuotasPrompt, interesPrompt);
        console.log(`Con un monto de ${montoPrompt} y ${cuotasPrompt} cuotas, tu pago mensual será: ${formatearMoneda(cuota, "UYU")}. Intereses totales: ${formatearMoneda(interesTotal, "UYU")}.`);
    } else {
        alert("Por favor ingresa datos válidos.");
    }
}

// Función para manejar el envío del formulario y mostrar los cálculos
function manejarFormulario(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Capturar valores del formulario
    const monto = parseFloat(document.getElementById("monto").value);
    const cuotas = parseInt(document.getElementById("cuotas").value);
    const interes = parseFloat(document.getElementById("interes").value);
    const moneda = document.getElementById("moneda").value;

    // Convertir el monto a pesos uruguayos según el tipo de cambio
    const montoEnPesos = monto * obtenerTipoCambio(moneda);

    // Si los datos son válidos, mostrar resultados
    if (validarDatos(montoEnPesos, cuotas, interes)) {
        const { cuota, totalPagado, interesTotal } = calcularPagoTotal(montoEnPesos, cuotas, interes);
        mostrarDetalles(cuota, totalPagado, interesTotal, moneda);
        mostrarDesglosePlazos(montoEnPesos, interes, moneda);
    } else {
        document.getElementById("resultado").innerText = "Por favor, ingrese valores válidos.";
        document.getElementById("resultadoPlazos").innerText = "";
        alert("Por favor ingresa valores válidos."); // Mostrar mensaje de error solo si los datos son inválidos
    }
}

// Vincular las funciones a los eventos del formulario
document.getElementById("simulador").addEventListener("submit", manejarFormulario);
document.getElementById("calcularCapacidadPago").addEventListener("click", calcularCapacidadPago);
