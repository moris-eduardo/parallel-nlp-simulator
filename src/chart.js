/**
 * chart.js
 * ─────────────────────────────────────────────────────────────
 * Módulo de renderizado de la gráfica de barras comparativa
 * usando Chart.js 4.x.
 *
 * Estrategia de actualización eficiente:
 *   - Primera llamada: crea el objeto Chart y lo guarda en `_chart`.
 *   - Llamadas posteriores: actualiza datos y llama chart.update()
 *     sin destruir/recrear el canvas (evita parpadeo).
 */

'use strict';

/** Referencia al objeto Chart (null hasta el primer render). */
let _chart = null;

/**
 * Renderiza o actualiza la gráfica de barras comparativa.
 *
 * @param {number[]} labels         - Etiquetas del eje X (docs procesados).
 * @param {number[]} monoData       - Serie de tiempos monohilo (ms).
 * @param {number[]} parallelData   - Serie de tiempos paralelo (ms).
 */
function renderChart(labels, monoData, parallelData) {
  const canvas = document.getElementById('mainChart');

  // ── Actualización eficiente ──────────────────────────────
  if (_chart) {
    _chart.data.labels            = labels;
    _chart.data.datasets[0].data  = monoData;
    _chart.data.datasets[1].data  = parallelData;
    _chart.update();
    return;
  }

  // ── Creación inicial ─────────────────────────────────────
  _chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label:           'Monohilo',
          data:            monoData,
          backgroundColor: '#555560',
          borderRadius:    3,
          barPercentage:   0.45,
        },
        {
          label:           'Paralelo',
          data:            parallelData,
          backgroundColor: '#1D9E75',
          borderRadius:    3,
          barPercentage:   0.45,
        }
      ]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1d27',
          borderColor:     'rgba(255,255,255,0.1)',
          borderWidth:     1,
          titleColor:      '#e8e8e8',
          bodyColor:       '#aaa',
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} ms`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font:         { size: 11 },
            color:        '#666',
            autoSkip:     false,
            maxRotation:  0,
          },
          grid:  { display: false },
          title: {
            display: true,
            text:    'Documentos procesados',
            font:    { size: 11 },
            color:   '#666',
          }
        },
        y: {
          ticks: {
            font:     { size: 11 },
            color:    '#666',
            callback: v => v + ' ms',
          },
          grid:  { color: 'rgba(255,255,255,0.05)' },
          title: {
            display: true,
            text:    'Tiempo de ejecución (ms)',
            font:    { size: 11 },
            color:   '#666',
          }
        }
      }
    }
  });
}
