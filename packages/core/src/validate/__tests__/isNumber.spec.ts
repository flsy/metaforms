import { Validation } from '../interfaces';
import { isNumber } from '../rules';
import { validateField } from '../validate';

describe('isNumber', () => {
  const validation: Validation[] = [isNumber('Is not a number')];

  it('should return an error message when value is not a number', () => {
    const errorMessage = validateField({}, { value: 'a', validation });
    expect(errorMessage).toEqual('Is not a number');
  });

  it('should not return an error when value is a number', () => {
    const errorMessage = validateField({}, { value: 3, validation });
    expect(errorMessage).toEqual(undefined);
  });

  it('should not return an error when value is empty string', () => {
    const errorMessage = validateField({}, { value: '', validation });
    expect(errorMessage).toEqual(undefined);
  });

  it('should not return an error when value is 0', () => {
    const errorMessage = validateField({}, { value: 0, validation });
    expect(errorMessage).toEqual(undefined);
  });
});
