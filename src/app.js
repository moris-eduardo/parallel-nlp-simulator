/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 * Punto de entrada de la aplicación.
 * Conecta los controles de la UI con los módulos de simulación
 * (simulation.js) y renderizado (chart.js).
 *
 * Flujo principal:
 *   1. El usuario ajusta un slider (docs o workers).
 *   2. update() lee los valores actuales.
 *   3. Llama a calcTimes(), calcSpeedup(), calcSaving() para
 *      obtener las métricas.
 *   4. Actualiza las tarjetas de métricas en el DOM.
 *   5. Genera las series con buildLabels/buildMonoSeries/
 *      buildParallelSeries y delega el render a renderChart().
 */

'use strict';

// ── Referencias al DOM ───────────────────────────────────────

const sliderDocs    = document.getElementById('ctrl-docs');
const sliderWorkers = document.getElementById('ctrl-workers');
const lblDocs       = document.getElementById('lbl-docs');
const lblWorkers    = document.getElementById('lbl-workers');
const statDocs      = document.getElementById('stat-docs');
const statWorkers   = document.getElementById('stat-workers');
const statSpeedup   = document.getElementById('stat-speedup');
const statSaving    = document.getElementById('stat-saving');

// ── Función principal de actualización ──────────────────────

/**
 * Lee los sliders, calcula métricas y actualiza la UI completa.
 * Se llama en cada evento 'input' de los sliders y al inicio.
 */
function update() {
  const docs    = parseInt(sliderDocs.value,    10);
  const workers = parseInt(sliderWorkers.value, 10);

  // Actualizar etiquetas de los sliders
  lblDocs.textContent    = docs;
  lblWorkers.textContent = workers;

  // Calcular tiempos con el modelo de simulación
  const { mono, parallel } = calcTimes(docs, workers);
  const speedup            = calcSpeedup(mono, parallel);
  const saving             = calcSaving(mono, parallel);

  // Actualizar tarjetas de métricas
  statDocs.textContent    = docs;
  statWorkers.textContent = workers;
  statSpeedup.textContent = speedup.toFixed(2) + 'x';
  statSaving.textContent  = saving.toFixed(1) + '%';

  // Color dinámico: rojo si paralelo es más lento (1 worker + overhead)
  const isSlower = parallel > mono;
  statSpeedup.style.color = isSlower ? '#E05252' : '#1D9E75';
  statSaving.style.color  = isSlower ? '#E05252' : '#1D9E75';

  // Generar series de datos para la gráfica
  const labels         = buildLabels(docs);
  const monoSeries     = buildMonoSeries(labels);
  const parallelSeries = buildParallelSeries(labels, workers);

  // Delegar el renderizado al módulo de Chart.js
  renderChart(labels, monoSeries, parallelSeries);
}

// ── Event listeners ──────────────────────────────────────────

sliderDocs.addEventListener('input',    update);
sliderWorkers.addEventListener('input', update);

// ── Render inicial ───────────────────────────────────────────

update();
