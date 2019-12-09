import { Validation } from '../interfaces';
import { minlength } from '../rules';
import { validateField } from '../validate';

describe('minlength', () => {
  const validation: Validation[] = [minlength({ message: 'min 3 characters', value: 3 })];

  it('should return an error if value has too few characters', () => {
    const errorMessage = validateField({}, { value: 'x', validation });

    expect(errorMessage).toEqual('min 3 characters');
  });

  it('should not return an error if value has enough characters', () => {
    const errorMessage = validateField({}, { value: 'name', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
