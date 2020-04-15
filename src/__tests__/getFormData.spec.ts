import { getFormData } from '../utils';
import { FieldType } from '../interfaces';

describe('getFormData', () => {
  it('returns formData from fields', () => {
    expect(getFormData([])).toEqual({});

    const fields1: FieldType[] = [{ name: 'field1', type: 'text' }];
    expect(getFormData(fields1)).toEqual({ field1: undefined });

    expect(getFormData([{ type: 'text', name: 'field1', value: 'some value' }] as FieldType[])).toEqual({
      field1: 'some value',
    });
  });

  it('returns formData from nested fields', () => {
    const fields: FieldType[] = [
      { name: 'a', type: 'text' },
      { name: 'b', type: 'text', value: 'valueB' },
      {
        name: 'groupA',
        type: 'group',
        fields: [
          { name: 'c', type: 'text', value: 'valueC' },
          { name: 'd', type: 'text' },
        ],
      },
    ];

    const expected = {
      a: undefined,
      b: 'valueB',
      c: 'valueC',
      d: undefined,
    };
    expect(getFormData(fields)).toEqual(expected);
  });
});
