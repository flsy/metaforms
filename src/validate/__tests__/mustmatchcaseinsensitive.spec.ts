import { Validation } from '../interfaces';
import { mustmatchcaseinsensitive } from '../rules';
import { validateField } from '../validate';
import { IForm } from '../../interfaces';
import { TextField } from '../../testInterfaces';

describe('mustmatchcaseinsensitive', () => {
  const validation: Validation[] = [mustmatchcaseinsensitive('Sorry, your email addresses do not match. Please try again', 'email')];

  type A = IForm<{ email: TextField }>;

  it('should return an error if value does not match, case is not sensitive', () => {
    const errorMessage = validateField<A>({ email: 'emails@emails.com' }, { type: 'text', value: 'email@email.com', validation });

    expect(errorMessage).toEqual('Sorry, your email addresses do not match. Please try again');
  });

  it('should not return an error if the value does match, case is not sensitive', () => {
    const errorMessage = validateField<A>({ email: 'email@email.com' }, { type: 'text', value: 'email@email.com', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
