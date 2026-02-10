const { calcWeightedGrade, percentile } = require('./grades');

describe('calcWeightedGrade', () => {
  describe('CASOS DE REFERENCIA OBLIGATORIOS MORAN DAVID', () => {
    test('CASO REFERENCIA: calcWeightedGrade([{score:80,weight:0.4},{score:90,weight:0.6}]) retorna 86.00', () => {
      const items = [
        { score: 80, weight: 0.4 },
        { score: 90, weight: 0.6 }
      ];
      expect(calcWeightedGrade(items)).toBe(86.00);
    });
  });

  describe('casos validos adicionales MORAN DAVID', () => {
    test('un solo elemento con peso 1', () => {
      const items = [{ score: 75, weight: 1.0 }];
      expect(calcWeightedGrade(items)).toBe(75.00);
    });
    
    test('tres elementos con pesos validos MORAN DAVID', () => {
      const items = [
        { score: 100, weight: 0.3 },
        { score: 80, weight: 0.3 },
        { score: 90, weight: 0.4 }
      ];
      // 100*0.3 + 80*0.3 + 90*0.4 = 30 + 24 + 36 = 90
      expect(calcWeightedGrade(items)).toBe(90.00);
    });

    test('scores en los límites (0 y 100) MORAN DAVID ', () => {
      const items = [
        { score: 0, weight: 0.5 },
        { score: 100, weight: 0.5 }
      ];
      expect(calcWeightedGrade(items)).toBe(50.00);
    });

    test('peso exacto en el límite de tolerancia', () => {
      const items = [
        { score: 80, weight: 0.4005 }, // suma será 1.001 (dentro de tolerancia)
        { score: 90, weight: 0.5995 }
      ];
      // 80 * 0.4005 + 90 * 0.5995 = 32.04 + 53.955 = 85.995 → 86.00
      expect(calcWeightedGrade(items)).toBe(86.00);
    });
  });

  describe('errores de tipo MORAN DAVID', () => {
    test('items no es un arreglo', () => {
      expect(() => calcWeightedGrade(null)).toThrow(TypeError);
      expect(() => calcWeightedGrade('invalid')).toThrow(TypeError);
      expect(() => calcWeightedGrade(123)).toThrow(TypeError);
    });

    test('item no es un objeto', () => {
      expect(() => calcWeightedGrade([null])).toThrow(TypeError);
      expect(() => calcWeightedGrade(['invalid'])).toThrow(TypeError);
      expect(() => calcWeightedGrade([123])).toThrow(TypeError);
    });

    test('score no es un número', () => {
      expect(() => calcWeightedGrade([{ score: 'invalid', weight: 0.5 }])).toThrow(TypeError);
      expect(() => calcWeightedGrade([{ score: null, weight: 0.5 }])).toThrow(TypeError);
    });

    test('weight no es un nmero MORAN DAVID', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: 'invalid' }])).toThrow(TypeError);
      expect(() => calcWeightedGrade([{ score: 80, weight: null }])).toThrow(TypeError);
    });
  });

  describe('errores de rango', () => {
    test('arreglo vacío', () => {
      expect(() => calcWeightedGrade([])).toThrow(RangeError);
    });

    test('score fuera de rango MORAN DAVID', () => {
      expect(() => calcWeightedGrade([{ score: -1, weight: 1.0 }])).toThrow(RangeError);
      expect(() => calcWeightedGrade([{ score: 101, weight: 1.0 }])).toThrow(RangeError);
    });

    test('weight fuera de rango MORAN DAVID', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: -0.1 }])).toThrow(RangeError);
      expect(() => calcWeightedGrade([{ score: 80, weight: 1.1 }])).toThrow(RangeError);
    });

    test('suma de pesos != 1 (fuera de tolerancia) MORAN DAVID', () => {
      expect(() => calcWeightedGrade([
        { score: 80, weight: 0.4 },
        { score: 90, weight: 0.5 } // suma = 0.9
      ])).toThrow(RangeError);

      expect(() => calcWeightedGrade([
        { score: 80, weight: 0.6 },
        { score: 90, weight: 0.6 } // suma = 1.2
      ])).toThrow(RangeError);
    });
  });
});
describe('percentile', () => {
  describe('CASOS DE REFERENCIA OBLIATORIOS MORAN DAVID', () => {
    test('CASO REFERENCIA: percentile(0,[1,2,3]) retorna 1.00', () => {
      expect(percentile(0, [1, 2, 3])).toBe(1.00);
    });

    test('CASO REFERENCIA: percentile(100,[1,2,3]) retorna 3.00 ', () => {
      expect(percentile(100, [1, 2, 3])).toBe(3.00);
    });

    test('CASO REFERENCIA: percentile(50,[1,2,3,4]) retorna 2.00 (nearest-rank)', () => {
      expect(percentile(50, [1, 2, 3, 4])).toBe(2.00);
    });
  });

  describe('casos válidos adicioales', () => {
    test('un solo elemento', () => {
      expect(percentile(0, [5])).toBe(5.00);
      expect(percentile(50, [5])).toBe(5.00);
      expect(percentile(100, [5])).toBe(5.00);
    });

    test('arreglo desordenado', () => {
      expect(percentile(50, [4, 1, 3, 2])).toBe(2.00);
    });

    test('percentiles intermedios', () => {
      const values = [1, 2, 3, 4, 5];
      expect(percentile(25, values)).toBe(2.00); // ceil(0.25 * 5) = 2, index=1
      expect(percentile(75, values)).toBe(4.00); // ceil(0.75 * 5) = 4, index=3
    });

    test('valores dcimales', () => {
      expect(percentile(50, [1.5, 2.7, 3.1])).toBe(2.70);
    });

    test('valores negativos', () => {
      expect(percentile(0, [-3, -1, -2])).toBe(-3.00);
      expect(percentile(100, [-3, -1, -2])).toBe(-1.00);
    });

    test('valores duplicados', () => {
      expect(percentile(50, [1, 2, 2, 3])).toBe(2.00);
    });

    test('percentil 1 y 99 MORAN DAVID', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(percentile(1, values)).toBe(1.00); // ceil(0.01 * 10) = 1
      expect(percentile(99, values)).toBe(10.00); // ceil(0.99 * 10) = 10
    });
  });

  describe('errores de tipo', () => {
    test('p no es un número', () => {
      expect(() => percentile('invalid', [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(null, [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(undefined, [1, 2, 3])).toThrow(TypeError);
    });
    test('values no es un arreglo', () => {
      expect(() => percentile(50, null)).toThrow(TypeError);
      expect(() => percentile(50, 'invalid')).toThrow(TypeError);
      expect(() => percentile(50, 123)).toThrow(TypeError);
    });

    test('valores no numéricos en el arreglo', () => {
      expect(() => percentile(50, [1, 'invalid', 3])).toThrow(TypeError);
      expect(() => percentile(50, [1, null, 3])).toThrow(TypeError);
      expect(() => percentile(50, [1, undefined, 3])).toThrow(TypeError);
    });
  });

  describe('errores de rango', () => {
    test('p fuera del rango [0,100]', () => {
      expect(() => percentile(-1, [1, 2, 3])).toThrow(RangeError);
      expect(() => percentile(101, [1, 2, 3])).toThrow(RangeError);
    });

    test('arreglo vacío', () => {
      expect(() => percentile(50, [])).toThrow(RangeError);
    });
  });
});