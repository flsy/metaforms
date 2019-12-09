import { maxlength } from '../rules';
import { validateField } from '../validate';

describe('maxlength', () => {
  const validation = [maxlength({ message: 'max 5 characters long', value: 5 })];

  it('should return an error if the entered text exceeds the max length rule', () => {
    const errorMessage = validateField({}, { value: 'honzaxx', validation });

    expect(errorMessage).toEqual('max 5 characters long');
  });

  it('should not return an error if the entered text does not exceed the max length rule', () => {
    const errorMessage = validateField({}, { value: 'o', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error if the entered text exceeds the max length rule of the second rule', () => {
    const errorMessage = validateField(
      {},
      {
        value: 'honza',
        validation: [maxlength({ message: 'max 6 characters long', value: 6 }, { message: 'max 4 characters long', value: 4 }, { message: 'max 2 characters long', value: 2 })],
      },
    );

    expect(errorMessage).toEqual('max 4 characters long');
  });
});
