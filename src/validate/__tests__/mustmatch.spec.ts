import { mustmatch } from '../rules';
import { validateField } from '../validate';

describe('mustmatch', () => {
  const validation = [mustmatch("The passwords you entered didn't match. Please try again", 'password')];

  it('should return an error when the specified field values do not match', () => {
    const errorMessage = validateField({ password: 'bob' }, { value: 'joe12334', validation });

    expect(errorMessage).toEqual("The passwords you entered didn't match. Please try again");
  });

  it('should not return an error when the specified field values match', () => {
    const errorMessage = validateField({ password: 'joe12334' }, { value: 'joe12334', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('does not return an error when both passwords are empty', () => {
    const errorMessage = validateField({}, { value: '', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
