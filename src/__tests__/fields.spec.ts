import { FieldType, getFormData, hasError, maxlength, pattern, required, setFieldValue, validateForm } from '..';
import { compose } from 'fputils';

const fields: FieldType[] = [
  {
    type: 'text',
    name: 'name',
    validation: [required('fill name')],
  },
  {
    type: 'number',
    name: 'age',
    validation: [required('fill age'), maxlength({ message: 'max 3 digits', value: 3 })],
  },
  {
    type: 'datetime-local',
    name: 'born',
    validation: [required('fill DOB'), pattern({ message: 'wrong date format', value: '^[0-9]+$' })],
  },
];

describe('fields behaviour', () => {
  it('returns errors when fields are empty', () => {
    const result = validateForm(fields);

    expect(hasError(result)).toEqual(true);

    expect(result[0].errorMessage).toEqual('fill name');
    expect(result[1].errorMessage).toEqual('fill age');
    expect(result[2].errorMessage).toEqual('fill DOB');
  });

  it('returns errors when fields filled with wrong values', () => {
    const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 'Joel'), setFieldValue('born', 'xxx'))(fields);

    const result = validateForm(filled);

    expect(hasError(result)).toEqual(true);

    expect(result[0].errorMessage).toEqual(undefined);
    expect(result[1].errorMessage).toEqual('max 3 digits');
    expect(result[2].errorMessage).toEqual('wrong date format');
  });

  it('returns no errors when fields are properly filled', () => {
    const filled = compose(setFieldValue('name', 'Joel'), setFieldValue('age', 50), setFieldValue('born', '20'))(fields);

    const result = validateForm(filled);

    expect(hasError(result)).toEqual(false);

    expect(result[0].errorMessage).toEqual(undefined);
    expect(result[1].errorMessage).toEqual(undefined);
    expect(result[2].errorMessage).toEqual(undefined);

    expect(getFormData(filled)).toEqual({ name: 'Joel', age: 50, born: '20' });
  });
});
