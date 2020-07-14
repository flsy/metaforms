import { Validation } from '../interfaces';
import { max, min } from '../rules';
import { validateField } from '../validate';

describe('min', () => {
  const validation: Validation[] = [min('min value is 10', 10)];

  it('should return an error if value is lower than 10', () => {
    const errorMessage = validateField({}, { value: 9, validation });

    expect(errorMessage).toEqual('min value is 10');
  });

  it('should return an error if value is  not a number', () => {
    const errorMessage = validateField({}, { value: '3', validation });

    expect(errorMessage).toEqual('min value is 10');
  });

  it('should return undefined if value is  not a number', () => {
    const errorMessage = validateField({}, { value: 'Hello world', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return undefined if value is greater than 10', () => {
    const errorMessage = validateField({}, { value: 11, validation });

    expect(errorMessage).toEqual(undefined);
  });
});

describe('max', () => {
  const validation: Validation[] = [max('max value is 10', 10)];

  it('should return an error if value is greater than 10', () => {
    const errorMessage = validateField({}, { value: 11, validation });

    expect(errorMessage).toEqual('max value is 10');
  });

  it('should parse string if possible and return and return error when value greater than 10', () => {
    const errorMessage = validateField({}, { value: '11', validation });

    expect(errorMessage).toEqual('max value is 10');
  });

  it('should return undefined if value is  not a number', () => {
    const errorMessage = validateField({}, { value: 'Hello world', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
