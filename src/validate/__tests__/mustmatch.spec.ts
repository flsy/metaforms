import { mustmatch } from '../rules';
import { validateField } from '../validate';
import { IForm } from '../../interfaces';
import { TextField } from '../../testInterfaces';

describe('mustmatch', () => {
  const validation = [mustmatch("The passwords you entered didn't match. Please try again", 'password')];

  type A = IForm<{ password: TextField }>;

  it('should return an error when the specified field values do not match', () => {
    const errorMessage = validateField<A>({ password: 'bob' }, { type: 'text', value: 'joe12334', validation });

    expect(errorMessage).toEqual("The passwords you entered didn't match. Please try again");
  });

  it('should not return an error when the specified field values match', () => {
    const errorMessage = validateField<A>({ password: 'joe12334' }, { type: 'text', value: 'joe12334', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('does not return an error when both passwords are empty', () => {
    const errorMessage = validateField<A>({} as any, { type: 'text', value: '', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
