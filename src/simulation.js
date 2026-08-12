/**
 * simulation.js
 * ─────────────────────────────────────────────────────────────
 * Módulo de simulación de la arquitectura paralela vs monohilo
 * para tareas de NLP (tokenización, frecuencias, sentimiento).
 *
 * El modelo representa el tiempo de ejecución según:
 *   T_mono     = docs * BASE_MS_PER_DOC
 *   T_parallel = (docs / workers) * BASE_MS_PER_DOC * (1 + OVERHEAD)
 *
 * OVERHEAD modela el costo de fork/join (distribución de chunks
 * al dispatcher + merge de resultados en el aggregator).
 */

'use strict';

// ── Constantes del modelo ────────────────────────────────────

/** Overhead de coordinación fork/join (12 %). */
const OVERHEAD = 0.12;

/** Tiempo base de procesamiento NLP por documento (ms). */
const BASE_MS_PER_DOC = 4.2;

// ── Funciones públicas ───────────────────────────────────────

/**
 * Calcula los tiempos de ejecución para ambas arquitecturas.
 *
 * @param {number} docs    - Número de documentos a procesar.
 * @param {number} workers - Número de workers paralelos.
 * @returns {{ mono: number, parallel: number }} Tiempos en ms.
 */
function calcTimes(docs, workers) {
  const mono     = docs * BASE_MS_PER_DOC;
  const parallel = (docs / workers) * BASE_MS_PER_DOC * (1 + OVERHEAD);
  return { mono, parallel };
}

/**
 * Calcula el Speedup: cuántas veces más rápido es el sistema paralelo.
 *
 * Basado en la Ley de Amdahl:
 *   Speedup = T_mono / T_parallel
 *
 * @param {number} mono     - Tiempo monohilo (ms).
 * @param {number} parallel - Tiempo paralelo (ms).
 * @returns {number} Factor de aceleración.
 */
function calcSpeedup(mono, parallel) {
  return mono / parallel;
}

/**
 * Calcula el porcentaje de tiempo ahorrado al usar paralelismo.
 *
 * @param {number} mono     - Tiempo monohilo (ms).
 * @param {number} parallel - Tiempo paralelo (ms).
 * @returns {number} Porcentaje de ahorro (0–100).
 */
function calcSaving(mono, parallel) {
  return ((mono - parallel) / mono) * 100;
}

/**
 * Genera las etiquetas del eje X dividiendo el rango [0, docs]
 * en hasta 8 puntos equidistantes, más el valor máximo exacto.
 *
 * @param {number} docs - Número máximo de documentos.
 * @returns {number[]} Array de valores para el eje X.
 */
function buildLabels(docs) {
  const step   = Math.max(1, Math.floor(docs / 8));
  const labels = [];
  for (let d = step; d <= docs; d += step) labels.push(d);
  if (labels[labels.length - 1] !== docs) labels.push(docs);
  return labels;
}

/**
 * Genera los datos de la serie monohilo para cada punto del eje X.
 *
 * @param {number[]} labels - Puntos del eje X.
 * @returns {number[]} Tiempos en ms.
 */
function buildMonoSeries(labels) {
  return labels.map(d => parseFloat((d * BASE_MS_PER_DOC).toFixed(1)));
}

/**
 * Genera los datos de la serie paralela para cada punto del eje X.
 *
 * @param {number[]} labels  - Puntos del eje X.
 * @param {number}   workers - Número de workers.
 * @returns {number[]} Tiempos en ms.
 */
function buildParallelSeries(labels, workers) {
  return labels.map(d =>
    parseFloat(((d / workers) * BASE_MS_PER_DOC * (1 + OVERHEAD)).toFixed(1))
  );
}
