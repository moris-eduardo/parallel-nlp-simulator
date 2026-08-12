# Arquitectura en Paralelo — Procesamiento NLP

Aplicación interactiva que compara el rendimiento de una arquitectura
de procesamiento **paralela** vs **monohilo** para tareas de NLP
(tokenización, conteo de frecuencias y análisis de sentimiento).

## Estructura del proyecto

```
parallel-nlp-app/
├── index.html        # Estructura HTML y carga de módulos
└── src/
    ├── styles.css    # Estilos (dark theme, responsive)
    ├── simulation.js # Modelo matemático de la simulación
    ├── chart.js      # Renderizado con Chart.js 4.x
    └── app.js        # Punto de entrada — conecta UI y módulos
```

## Cómo ejecutar

No requiere bundler ni servidor de build. Abre directamente en el navegador:

```bash
# Opción 1 — Abrir el archivo directamente
open index.html

# Opción 2 — Servidor local simple (recomendado)
npx serve .
# o
python3 -m http.server 8080
```

Luego visita `http://localhost:8080` en tu navegador.

## Dependencias

- [Chart.js 4.4.1](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js)
  — cargado vía CDN, no requiere instalación.

## Modelo matemático

| Arquitectura | Fórmula |
|---|---|
| Monohilo | `T = docs × 4.2 ms` |
| Paralela | `T = (docs / workers) × 4.2 ms × 1.12` |

El **12 % de overhead** modela el costo del patrón Fork-Join:
distribución de chunks (Dispatcher) + merge de resultados (Aggregator).

El **Speedup** sigue la Ley de Amdahl:
`Speedup = T_mono / T_paralelo`

## Parámetros ajustables

| Parámetro | Rango | Default |
|---|---|---|
| Documentos | 100 – 2000 | 500 |
| Workers paralelos | 1 – 16 | 4 |

## Autor

Eduardo Rivera Acosta — FIME UANL, Ingeniería en Tecnologías de Software
