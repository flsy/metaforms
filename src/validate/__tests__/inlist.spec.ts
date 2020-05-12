import { Validation } from '../interfaces';
import { inList } from '../rules';
import { validateField } from '../validate';

describe('inlist', () => {
  const validation: Validation[] = [inList('Title was not a valid choice', ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Rev', 'Prof', 'Other'])];

  it('should return an error if the user selects an invalid option', () => {
    const errorMessage = validateField({}, { value: 'Sir', validation });

    expect(errorMessage).toEqual('Title was not a valid choice');
  });

  it('should not return an error if the user selects something in the list of options', () => {
    const errorMessage = validateField({}, { value: 'Mr', validation });

    expect(errorMessage).toEqual(undefined);
  });
});
