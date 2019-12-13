import { Validation } from '../interfaces';
import { mustbeequal } from '../rules';
import { validateField } from '../validate';

describe('mustbeequal', () => {
  const validation: Validation[] = [mustbeequal({ message: 'You need to agree to the terms and conditions', value: true })];

  it('should return an error if the value is not equal to the specified value', () => {
    const errorMessage = validateField({}, { value: false, validation });

    expect(errorMessage).toEqual('You need to agree to the terms and conditions');
  });

  it('should not return an error if the value is equal to the specified value', () => {
    const errorMessage = validateField({}, { value: true, validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should work for number types', () => {
    expect(validateField({}, { value: 5, validation: [mustbeequal({ message: 'no', value: true })] })).toEqual('no');
    expect(validateField({}, { value: 5, validation: [mustbeequal({ message: 'no', value: 6 })] })).toEqual('no');
    expect(validateField({}, { value: 5, validation: [mustbeequal({ message: 'no', value: 5 })] })).toEqual(undefined);
  });
});
