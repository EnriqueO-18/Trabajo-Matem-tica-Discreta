const ESTADOS = ["Nublado", "Parcialmente nublado", "Parcialmente soleado", "Soleado"];
const ABREVIATURAS = ["NU", "PN", "PS", "SO"];

let historial = [];
let matrizTransicion = [];

document.addEventListener('DOMContentLoaded', function() {

    setWeatherIcons();

    document.getElementById('generate-btn').addEventListener('click', generarHistorial);
    document.getElementById('forecast-btn').addEventListener('click', generarPronostico);
});

function setWeatherIcons() {

    const nuIcon = document.getElementById('icon-NU');
    nuIcon.outerHTML = `<svg width="80" height="80" viewBox="0 0 100 100" class="weather-icon" id="icon-NU">
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
        </linearGradient>
        <circle cx="50" cy="50" r="30" fill="url(#cloudGrad)" />
        <circle cx="35" cy="40" r="20" fill="url(#cloudGrad)" />
        <circle cx="65" cy="40" r="20" fill="url(#cloudGrad)" />
        <circle cx="35" cy="60" r="15" fill="url(#cloudGrad)" />
        <circle cx="65" cy="60" r="15" fill="url(#cloudGrad)" />
    </svg>`;

    const pnIcon = document.getElementById('icon-PN');
    pnIcon.outerHTML = `<svg width="80" height="80" viewBox="0 0 100 100" class="weather-icon" id="icon-PN">
        <circle cx="30" cy="30" r="20" fill="#FFD700" /> <!-- Sol -->
        <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
        </linearGradient>
        <circle cx="60" cy="60" r="25" fill="url(#cloudGrad2)" />
        <circle cx="45" cy="50" r="15" fill="url(#cloudGrad2)" />
        <circle cx="75" cy="50" r="15" fill="url(#cloudGrad2)" />
    </svg>`;

    const psIcon = document.getElementById('icon-PS');
    psIcon.outerHTML = `<svg width="80" height="80" viewBox="0 0 100 100" class="weather-icon" id="icon-PS">
        <circle cx="60" cy="40" r="25" fill="#FFD700" /> <!-- Sol grande -->
        <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
        </linearGradient>
        <circle cx="35" cy="70" r="20" fill="url(#cloudGrad3)" />
        <circle cx="20" cy="60" r="10" fill="url(#cloudGrad3)" />
        <circle cx="50" cy="65" r="10" fill="url(#cloudGrad3)" />
    </svg>`;

    const soIcon = document.getElementById('icon-SO');
    soIcon.outerHTML = `<svg width="80" height="80" viewBox="0 0 100 100" class="weather-icon" id="icon-SO">
        <circle cx="50" cy="50" r="30" fill="#FFD700" /> <!-- Sol -->
        <g fill="#FFD700">
            <rect x="48" y="10" width="4" height="15" />
            <rect x="48" y="75" width="4" height="15" />
            <rect x="10" y="48" width="15" height="4" />
            <rect x="75" y="48" width="15" height="4" />
            <rect x="20" y="20" width="10" height="4" transform="rotate(45 25 22)" />
            <rect x="70" y="70" width="10" height="4" transform="rotate(45 75 72)" />
            <rect x="70" y="20" width="10" height="4" transform="rotate(-45 75 22)" />
            <rect x="20" y="70" width="10" height="4" transform="rotate(-45 25 72)" />
        </g>
    </svg>`;
}

function generarHistorialAleatorio(nDias) {
    const hist = [];
    for (let i = 0; i < nDias; i++) {
        const estadoAleatorio = ABREVIATURAS[Math.floor(Math.random() * ABREVIATURAS.length)];
        hist.push(estadoAleatorio);
    }
    return hist;
}

function construirMatrizTransicion(hist, estadosPosibles) {
    const n = estadosPosibles.length;
    const contadorTransiciones = Array(n).fill().map(() => Array(n).fill(0));

    for (let i = 0; i < hist.length - 1; i++) {
        const indiceActual = ABREVIATURAS.indexOf(hist[i]);
        const indiceSiguiente = ABREVIATURAS.indexOf(hist[i+1]);
        contadorTransiciones[indiceActual][indiceSiguiente]++;
    }

    const matriz = [];
    for (let i = 0; i < n; i++) {
        const filaProbabilidades = [];
        const sumaFila = contadorTransiciones[i].reduce((a, b) => a + b, 0);

        for (let j = 0; j < n; j++) {
            let probabilidad;
            if (sumaFila > 0) {
                probabilidad = contadorTransiciones[i][j] / sumaFila;
            } else {
                probabilidad = 1.0 / n;
            }

            filaProbabilidades.push(probabilidad);
        }

        matriz.push(filaProbabilidades);
    }

    return matriz;
}

function mostrarHistorial(hist) {
    const historyDisplay = document.getElementById('history-display');
    let html = '<div class="table-responsive"><table><tr><th>DÍA</th>';

    for (let i = hist.length; i > 0; i--) {
        html += `<th>${i}</th>`;
    }
    html += '</tr><tr><th>CLIMA</th>';

    for (let i = 0; i < hist.length; i++) {
        const estado = hist[i];
        const iconHtml = getWeatherIconSmall(estado);
        html += `<td>${estado}<br>${iconHtml}</td>`;
    }
    html += '</tr></table></div>';

    historyDisplay.innerHTML = html;
}

function mostrarMatrizTransicion(matriz) {
    const matrixTable = document.getElementById('transition-matrix');
    let html = '<tr><th></th>';

    for (const estado of ESTADOS) {
        html += `<th>${estado.substr(0, 3)}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < ESTADOS.length; i++) {
        html += `<tr><th>${ESTADOS[i]}</th>`;
        for (let j = 0; j < ESTADOS.length; j++) {
            html += `<td>${matriz[i][j].toFixed(2)}</td>`;
        }
        html += '</tr>';
    }

    matrixTable.innerHTML = html;
}

function pronosticarSiguienteDia(estadoActual, matriz) {
    const indiceActual = ABREVIATURAS.indexOf(estadoActual);
    const probabilidades = matriz[indiceActual];

    const r = Math.random();
    let acumulado = 0;
    for (let i = 0; i < probabilidades.length; i++) {
        acumulado += probabilidades[i];
        if (r <= acumulado) {
            return ABREVIATURAS[i];
        }
    }

    return ABREVIATURAS[ABREVIATURAS.length - 1];
}

function pronosticarNDias(estadoInicial, n, matriz) {
    const pronostico = [];
    let estadoActual = estadoInicial;

    for (let i = 0; i < n; i++) {
        const siguienteEstado = pronosticarSiguienteDia(estadoActual, matriz);
        pronostico.push(siguienteEstado);
        estadoActual = siguienteEstado;
    }

    return pronostico;
}

function multiplicarMatrices(a, b) {
    const filasA = a.length;
    const colsA = a[0].length;
    const colsB = b[0].length;

    const resultado = Array(filasA).fill().map(() => Array(colsB).fill(0));

    for (let i = 0; i < filasA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                resultado[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return resultado;
}

function potenciaMatriz(matriz, n) {
    if (n === 1) {
        return matriz;
    }

    if (n === 0) {
        const identidad = [];
        for (let i = 0; i < matriz.length; i++) {
            const fila = Array(matriz.length).fill(0);
            fila[i] = 1;
            identidad.push(fila);
        }
        return identidad;
    }

    if (n % 2 === 0) {
        const mitad = potenciaMatriz(matriz, n / 2);
        return multiplicarMatrices(mitad, mitad);
    } else {
        return multiplicarMatrices(matriz, potenciaMatriz(matriz, n - 1));
    }
}

function distribucionLargoPlazo(matriz, iteraciones = 50) {
    try {
        const matrizPotencia = potenciaMatriz(matriz, iteraciones);
        const estadoEstacionario = matrizPotencia[0];

        const distribucion = {};
        for (let i = 0; i < ESTADOS.length; i++) {
            distribucion[ESTADOS[i]] = estadoEstacionario[i];
        }

        return distribucion;
    } catch (e) {
        console.error("Error calculando distribución a largo plazo:", e);
        return null;
    }
}

function mostrarPronostico(pronostico) {
    const forecastDisplay = document.getElementById('forecast-display');
    let html = '<div>';

    html += '<div><strong>DÍA</strong>: ';
    for (let i = 1; i <= pronostico.length; i++) {
        html += `<span class="forecast-day">+${i}</span>`;
    }
    html += '</div>';

    html += '<div><strong>CLIMA</strong>: ';
    for (const estado of pronostico) {
        html += `<span class="forecast-day">${estado}<br>${getWeatherIconSmall(estado)}</span>`;
    }
    html += '</div>';

    forecastDisplay.innerHTML = html;
}

function mostrarLargoPlazo(distribucion) {
    if (!distribucion) {
        document.getElementById('long-term-display').innerHTML = 
            '<p>No se pudo calcular la distribución a largo plazo.</p>';
        return;
    }

    let html = '<table><tr><th>Estado</th><th>Probabilidad</th><th>Representación</th></tr>';

    for (const estado in distribucion) {
        const porcentaje = distribucion[estado] * 100;
        html += `<tr>
            <td>${estado}</td>
            <td>${porcentaje.toFixed(2)}%</td>
            <td>
                <div style="background-color: #3498db; height: 20px; width: ${porcentaje}%;"></div>
            </td>
        </tr>`;
    }

    html += '</table>';
    document.getElementById('long-term-display').innerHTML = html;
}

function getWeatherIconSmall(abreviatura) {

    switch (abreviatura) {
        case 'NU':
            return `<svg width="24" height="24" viewBox="0 0 100 100">
                <linearGradient id="cloudGradS" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
                </linearGradient>
                <circle cx="50" cy="50" r="30" fill="url(#cloudGradS)" />
                <circle cx="35" cy="40" r="20" fill="url(#cloudGradS)" />
                <circle cx="65" cy="40" r="20" fill="url(#cloudGradS)" />
                <circle cx="35" cy="60" r="15" fill="url(#cloudGradS)" />
                <circle cx="65" cy="60" r="15" fill="url(#cloudGradS)" />
            </svg>`;
        case 'PN':
            return `<svg width="24" height="24" viewBox="0 0 100 100">
                <circle cx="30" cy="30" r="20" fill="#FFD700" />
                <linearGradient id="cloudGrad2S" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
                </linearGradient>
                <circle cx="60" cy="60" r="25" fill="url(#cloudGrad2S)" />
                <circle cx="45" cy="50" r="15" fill="url(#cloudGrad2S)" />
                <circle cx="75" cy="50" r="15" fill="url(#cloudGrad2S)" />
            </svg>`;
        case 'PS':
            return `<svg width="24" height="24" viewBox="0 0 100 100">
                <circle cx="60" cy="40" r="25" fill="#FFD700" />
                <linearGradient id="cloudGrad3S" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f2f2f2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#d9d9d9;stop-opacity:1" />
                </linearGradient>
                <circle cx="35" cy="70" r="20" fill="url(#cloudGrad3S)" />
                <circle cx="20" cy="60" r="10" fill="url(#cloudGrad3S)" />
                <circle cx="50" cy="65" r="10" fill="url(#cloudGrad3S)" />
            </svg>`;
        case 'SO':
            return `<svg width="24" height="24" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="30" fill="#FFD700" />
                <g fill="#FFD700">
                    <rect x="48" y="10" width="4" height="15" />
                    <rect x="48" y="75" width="4" height="15" />
                    <rect x="10" y="48" width="15" height="4" />
                    <rect x="75" y="48" width="15" height="4" />
                    <rect x="20" y="20" width="10" height="4" transform="rotate(45 25 22)" />
                    <rect x="70" y="70" width="10" height="4" transform="rotate(45 75 72)" />
                    <rect x="70" y="20" width="10" height="4" transform="rotate(-45 75 22)" />
                    <rect x="20" y="70" width="10" height="4" transform="rotate(-45 25 72)" />
                </g>
            </svg>`;
        default:
            return '';
    }
}

function generarHistorial() {

    document.getElementById('loader').classList.remove('hidden');

    setTimeout(() => {
        const nDias = parseInt(document.getElementById('days-input').value);

        if (isNaN(nDias) || nDias < 20 || nDias > 40) {
            alert('El número de días debe estar entre 20 y 40.');
            document.getElementById('loader').classList.add('hidden');
            return;
        }

        historial = generarHistorialAleatorio(nDias);
        mostrarHistorial(historial);
        document.getElementById('history-section').classList.remove('hidden');

        matrizTransicion = construirMatrizTransicion(historial, ESTADOS);
        mostrarMatrizTransicion(matrizTransicion);
        document.getElementById('matrix-section').classList.remove('hidden');

        document.getElementById('forecast-controls').classList.remove('hidden');

        document.getElementById('forecast-section').classList.add('hidden');
        document.getElementById('long-term-section').classList.add('hidden');

        document.getElementById('loader').classList.add('hidden');
    }, 500);
}

function generarPronostico() {

    document.getElementById('loader').classList.remove('hidden');

    setTimeout(() => {
        const diasPronostico = parseInt(document.getElementById('forecast-days').value);

        if (isNaN(diasPronostico) || diasPronostico < 1) {
            alert('El número de días a pronosticar debe ser positivo.');
            document.getElementById('loader').classList.add('hidden');
            return;
        }

        const estadoInicial = historial[historial.length - 1];
        const pronostico = pronosticarNDias(estadoInicial, diasPronostico, matrizTransicion);
        mostrarPronostico(pronostico);
        document.getElementById('forecast-section').classList.remove('hidden');

        const distribucion = distribucionLargoPlazo(matrizTransicion);
        mostrarLargoPlazo(distribucion);
        document.getElementById('long-term-section').classList.remove('hidden');

        document.getElementById('loader').classList.add('hidden');
    }, 500);
}
