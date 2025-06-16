import { MathOperator } from '../types/math-operator.type';

export const applyOperatorToNumbers = (
  num1: number,
  num2: number,
  operator: MathOperator,
) => {
  const operators = {
    '>': num1 > num2,
    '<': num1 < num2,
    '>=': num1 >= num2,
    '<=': num1 <= num2,
    '=': num1 === num2,
  };
  return operators[operator];
};
