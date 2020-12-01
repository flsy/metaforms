import { mustnotcontain } from '../rules';
import { validateField } from '../validate';
import { IForm } from '../../interfaces';
import { TextField } from '../../testInterfaces';

describe('mustnotcontain', () => {
  const message = 'Please enter a valid password, it can`t contain your username';
  const validation = [mustnotcontain(message, 'username')];

  type A = IForm<{ username: TextField }>;

  it('returns error when it contains', () => {
    const errorMessage = validateField<A>({ username: 'Honza' }, { type: 'text', value: 'MyHonza', validation });

    expect(errorMessage).toEqual(message);
  });

  it('returns error when it equals', () => {
    const errorMessage = validateField<A>({ username: 'Honza' }, { type: 'text', value: 'HonzA', validation });

    expect(errorMessage).toEqual(message);
  });

  it('dos not return error when different value', () => {
    const errorMessage = validateField<A>({ username: 'Honza' }, { type: 'text', value: 'Frank', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('dos not return error when no form field in form', () => {
    const errorMessage = validateField<any>({ myName: 'Bob' }, { type: 'text', value: 'email@domain.com', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
