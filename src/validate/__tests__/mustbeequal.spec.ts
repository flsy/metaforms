import { Validation } from '../interfaces';
import { mustbeequal } from '../rules';
import { validateField } from '../validate';

describe('mustbeequal', () => {
  const validation: Validation[] = [mustbeequal('You need to agree to the terms and conditions', true)];

  it('should return an error if the value is not equal to the specified value', () => {
    const errorMessage = validateField({}, { value: false, validation });

    expect(errorMessage).toEqual('You need to agree to the terms and conditions');
  });

  it('should not return an error if the value is equal to the specified value', () => {
    const errorMessage = validateField({}, { value: true, validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should work for number types', () => {
    expect(validateField({}, { value: 5, validation: [mustbeequal('no', true)] })).toEqual('no');
    expect(validateField({}, { value: 5, validation: [mustbeequal('no', 6)] })).toEqual('no');
    expect(validateField({}, { value: 5, validation: [mustbeequal('no', 5)] })).toEqual(undefined);
  });
});
