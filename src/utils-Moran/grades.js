/**
 * Calcula una nota final ponderada a partir de componentes con peso.
 * @param {Array} items - Arreglo de objetos {score: número 0–100, weight: número 0–1}
 * @returns {number} - Nota final ponderada 0–100 con 2 decimales
 * @throws {TypeError} - Si los tipos no son válidos
 * @throws {RangeError} - Si los valores están fuera del rango permitido
 */
function calcWeightedGrade(items) {
  // Validación de tipo
  if (!Array.isArray(items)) {
    throw new TypeError('items debe ser un arreglo');
  }
  
  if (items.length === 0) {
    throw new RangeError('items no puede estar vacío');
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const item of items) {
    // Validar estructura del objeto
    if (typeof item !== 'object' || item === null) {
      throw new TypeError('cada item debe ser un objeto');
    }

    if (typeof item.score !== 'number' || typeof item.weight !== 'number') {
      throw new TypeError('score y weight deben ser números');
    }

    // Validar rangos
    if (item.score < 0 || item.score > 100) {
      throw new RangeError('score debe estar entre 0 y 100');
    }

    if (item.weight < 0 || item.weight > 1) {
      throw new RangeError('weight debe estar entre 0 y 1');
    }

    totalWeight += item.weight;
    weightedSum += item.score * item.weight;
  }

  // Validar que la suma de pesos sea 1 con tolerancia ±0.001
  if (Math.abs(totalWeight - 1) > 0.001) {
    throw new RangeError('La suma de los pesos debe ser 1 (tolerancia ±0.001)');
  }

  // Devolver resultado con 2 decimales
  return Number(weightedSum.toFixed(2));
}

/**
 * Devuelve el percentil p de una lista de números usando el método de rango más cercano.
 * @param {number} p - Percentil en [0,100]
 * @param {Array} values - Arreglo de números, longitud ≥ 1
 * @returns {number} - Valor del percentil con 2 decimales
 * @throws {TypeError} - Si los tipos no son válidos
 * @throws {RangeError} - Si los valores están fuera del rango permitido
 */
function percentile(p, values) {
  // Validación de tipos
  if (typeof p !== 'number') {
    throw new TypeError('p debe ser un número');
  }

  if (!Array.isArray(values)) {
    throw new TypeError('values debe ser un arreglo');
  }

  // Validar rangos
  if (p < 0 || p > 100) {
    throw new RangeError('p debe estar entre 0 y 100');
  }

  if (values.length < 1) {
    throw new RangeError('values debe tener al menos 1 elemento');
  }
  // Validar que todos los valores sean números - Moran David 
  for (const value of values) {
    if (typeof value !== 'number') {
      throw new TypeError('todos los valores deben ser números');
    }
  }

  // Ordenar valores ascendentemente
  const sortedValues = [...values].sort((a, b) => a - b);
  const N = sortedValues.length;

  // Reglas explícitas para bordes
  if (p === 0) {
    return Number(Math.min(...sortedValues).toFixed(2));
  }
  
  if (p === 100) {
    return Number(Math.max(...sortedValues).toFixed(2));
  }

  // Método nearest-rank: rank = ceil(p/100 × N) con indexación 1..N
  const rank = Math.ceil((p / 100) * N);
  
  // Convertir a índice 0 based
  const index = rank - 1;
  
  return Number(sortedValues[index].toFixed(2));
}

module.exports = {
  calcWeightedGrade,
  percentile
};

//npm test
//comando para ver la cobertura de pruebas en un ¡a tabla con porcentajes
//npm audit --audit-level=moderate
