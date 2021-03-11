import { IForm, getFormData, hasError, maxlength, pattern, required, setFieldValue, validateForm } from '..';
import { compose } from 'fputils';

const fields: IForm<any> = {
  name: {
    type: 'text',
    validation: [required('fill name')],
  },
  age: {
    type: 'number',
    validation: [required('fill age'), maxlength('max 3 digits', 3)],
  },
  born: {
    type: 'datetime-local',
    validation: [required('fill DOB'), pattern('wrong date format', '^[0-9]+$')],
  },
};

describe('fields behaviour', () => {
  it('returns errors when fields are empty', () => {
    const result = validateForm(fields);

    expect(hasError(result)).toEqual(true);

    expect(result.name.errorMessage).toEqual('fill name');
    expect(result.age.errorMessage).toEqual('fill age');
    expect(result.born.errorMessage).toEqual('fill DOB');
  });

  it('returns errors when fields filled with wrong values', () => {
    const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 'Joel'), setFieldValue('born', 'xxx'))(fields);

    const result = validateForm(filled);

    expect(hasError(result)).toEqual(true);

    expect(result?.name?.errorMessage).toEqual(undefined);
    expect(result?.age?.errorMessage).toEqual('max 3 digits');
    expect(result?.born?.errorMessage).toEqual('wrong date format');
  });

  it('returns no errors when fields are properly filled', () => {
    const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 50), setFieldValue('born', '20'))(fields);

    const result = validateForm(filled);

    expect(hasError(result)).toEqual(false);

    expect(result?.name?.errorMessage).toEqual(undefined);
    expect(result?.age?.errorMessage).toEqual(undefined);
    expect(result?.born?.errorMessage).toEqual(undefined);

    expect(getFormData(filled)).toEqual({ name: 'Joel', age: 50, born: '20' });
  });
});
