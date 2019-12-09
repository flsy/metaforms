import { Validation } from '../interfaces';
import { maxlength } from '../rules';
import { validateField } from '../validate';

describe('maxlength', () => {
  const validation: Validation[] = [maxlength({ message: 'max 5 characters long', value: 5 })];

  it('should return an error if the entered text exceeds the max length rule', () => {
    const errorMessage = validateField({}, { value: 'honzaxx', validation });

    expect(errorMessage).toEqual('max 5 characters long');
  });

  it('should not return an error if the entered text does not exceed the max length rule', () => {
    const errorMessage = validateField({}, { value: 'o', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
