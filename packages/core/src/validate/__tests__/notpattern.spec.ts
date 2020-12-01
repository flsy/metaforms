import { Validation } from '../interfaces';
import { notpattern } from '../rules';
import { validateField } from '../validate';

describe('notpattern', () => {
  const validation: Validation[] = [notpattern('invalid password', '[pP][aA][sS][sS][wW][oO][rR][dD]')];

  it('should not return an error if value is empty', () => {
    const errorMessage = validateField({}, { value: '', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error if value does not match pattern', () => {
    const errorMessage = validateField({}, { value: 'password', validation });

    expect(errorMessage).toEqual('invalid password');
  });

  it('should not return an error if the value does match the pattern', () => {
    const errorMessage = validateField({}, { value: 'hello', validation });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return the correct error when multiple rules are given', () => {
    const message = 'Sorry, your password must include spaces';
    const multipleValidations: Validation[] = [notpattern('invalid password', '[pP][aA][sS][sS][wW][oO][rR][dD]'), notpattern(message, '^\\S*$')];

    const errorMessage = validateField({}, { value: 'hellothere', validation: multipleValidations });
    expect(errorMessage).toEqual(multipleValidations[1].message);
  });
});
