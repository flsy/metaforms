import { Validation } from '../interfaces';
import { pattern } from '../rules';
import { validateField } from '../validate';

describe('pattern', () => {
  const validation: Validation[] = [pattern({ message: 'Sorry, your name can only include letters and spaces', value: "^[a-zA-Z \\'-]+$" })];

  it('should not display error if field value is empty', () => {
    const errorMessage = validateField({}, { value: '', validation });
    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error when a pattern rule has been violated', () => {
    const errorMessage = validateField({}, { value: 'as1', validation });
    expect(errorMessage).toEqual('Sorry, your name can only include letters and spaces');
  });

  it('should not return an error when a pattern rule has not been violated', () => {
    const errorMessage = validateField({}, { value: 'as', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return the correct error when multiple rules are given', () => {
    const message = 'Sorry, your name cannot include spaces';
    const multipleValidations: Validation[] = [
      pattern(
        {
          message: 'Sorry, your name can only include letters and spaces',
          value: "^[a-zA-Z \\'-]+$",
        },
        { message, value: '^\\S*$' },
      ),
    ];

    const errorMessage = validateField({}, { value: 'John Smith', validation: multipleValidations });

    expect(errorMessage).toEqual(message);
  });
});
