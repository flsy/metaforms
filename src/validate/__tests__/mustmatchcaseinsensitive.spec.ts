import { Validation } from '../interfaces';
import { mustmatchcaseinsensitive } from '../rules';
import { validateField } from '../validate';

describe('mustmatchcaseinsensitive', () => {
  const validation: Validation[] = [mustmatchcaseinsensitive('Sorry, your email addresses do not match. Please try again', 'email')];

  it('should return an error if value does not match, case is not sensitive', () => {
    const errorMessage = validateField({ email: 'emails@emails.com' }, { value: 'email@email.com', validation });

    expect(errorMessage).toEqual('Sorry, your email addresses do not match. Please try again');
  });

  it('should not return an error if the value does match, case is not sensitive', () => {
    const errorMessage = validateField({ email: 'email@email.com' }, { value: 'email@email.com', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
