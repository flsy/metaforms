import { Validation } from '../interfaces';
import { required } from '../rules';
import { validateField } from '../validate';

describe('required', () => {
  const validation: Validation[] = [required('Please enter your name')];

  it('should return an error message when the field value is empty', () => {
    const errorMessage = validateField({}, { value: '', validation });
    expect(errorMessage).toEqual('Please enter your name');
  });

  it('should not return an error message when the field value is not empty', () => {
    const errorMessage = validateField({}, { value: 'Jan', validation });
    expect(errorMessage).toEqual(undefined);
  });

  it('should work for numbers', () => {
    expect(validateField({}, { value: 0, validation })).toEqual(undefined);
    expect(validateField({}, { value: 5, validation })).toEqual(undefined);
  });
});
