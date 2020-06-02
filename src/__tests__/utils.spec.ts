import { getFieldValue, hasError, isRequired, setFieldOptions, setFieldValue, update, validate, validateForm } from '../utils';
import { FieldType } from '../interfaces';
import { Required, required } from '..';

describe('utils', () => {
  describe('isRequired', () => {
    it('should return correct value', () => {
      expect(isRequired([])).toEqual(false);
      expect(isRequired([required('is required')])).toEqual(true);
      // @ts-ignore
      expect(isRequired([{ type: 'blablabal' }])).toEqual(false);
    });
  });

  describe('hasError', () => {
    it('should return if form has error or not', () => {
      expect(hasError([])).toEqual(false);
      expect(hasError([{ errorMessage: '' }] as FieldType[])).toEqual(false);
      expect(hasError([{ errorMessage: undefined }] as FieldType[])).toEqual(false);
      expect(hasError([{ errorMessage: 'error' }] as FieldType[])).toEqual(true);

      const fields = [{ type: 'group', fields: [{ errorMessage: 'yes error' }] }] as FieldType[];
      expect(hasError(fields)).toEqual(true);
    });
  });

  describe('validateForm', () => {
    const message = 'This field is required error message';
    it('validates a form', () => {
      const fields = [
        {
          name: 'a',
          validation: [
            {
              type: 'required',
              message,
            },
          ],
        },
        {
          name: 'b',
        },
      ] as FieldType[];

      expect(validateForm(fields)[0].errorMessage).toEqual(message);
      expect(validateForm(fields)[1].errorMessage).toEqual(undefined);
    });

    it('validates a field with more validations', () => {
      const fields = [
        {
          name: 'name',
          value: 'v',
          validation: [
            {
              type: 'required',
              rules: [{ message: 'is required' }],
            },
            {
              type: 'minlength',
              value: 3,
              message: 'min 3 characters',
            },
          ],
        },
      ] as FieldType[];

      expect(validateForm(fields)[0].errorMessage).toEqual('min 3 characters');
    });

    it('validates a nested fields', () => {
      const required: Required = { type: 'required', message };
      const fields: FieldType[] = [
        { name: 'a', type: 'text', validation: [] },
        { name: 'b', type: 'text', validation: [required] },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text', validation: [required] },
            { name: 'd', type: 'text' },
          ],
        },
      ];

      const results = [undefined, message];
      const results2 = [message, undefined];

      const validated = validateForm(fields);
      validated.forEach((field, i) => {
        expect(field.errorMessage).toEqual(results[i]);
        if (field.fields) {
          field.fields.forEach((f, z) => {
            expect(f.errorMessage).toEqual(results2[z]);
          });
        }
      });
    });
  });

  describe('setFieldValue', () => {
    it('sets a value on exact field', () => {
      const fields = [{ name: 'a' }, { name: 'b' }] as FieldType[];

      expect(setFieldValue('a', 'hey yo!')(fields)[0].value).toEqual('hey yo!');
      expect(fields[1].value).toEqual(undefined);
      expect(setFieldValue('b', 'b yo!', fields)[1].value).toEqual('b yo!');
    });

    it('sets a numeric value', () => {
      const fields = [{ name: 'a' }] as FieldType[];

      expect(setFieldValue('a', 12)(fields)[0].value).toEqual(12);
    });

    it('sets a value on nested fields', () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'b',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text' },
          ],
        },
      ];

      const updated = setFieldValue(['b', 'c'], 'value C', fields);

      expect(updated).toEqual([
        { name: 'a', type: 'text' },
        {
          name: 'b',
          type: 'group',
          fields: [
            { name: 'c', type: 'text', value: 'value C' },
            { name: 'd', type: 'text' },
          ],
        },
      ]);
    });

    it("shouldn't set a value to nested field without groupName", () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'b',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text' },
          ],
        },
      ];

      const updated = setFieldValue('c', 'value C', fields);

      expect(updated).toEqual([
        { name: 'a', type: 'text' },
        {
          name: 'b',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text' },
          ],
        },
      ]);
    });
  });

  describe('setSelectOptions', () => {
    it('return an empty array when no fields are passed in', () => {
      const result = setFieldOptions('name', [])([]);
      expect(result).toEqual([]);
    });

    it('returns a field with no options when no options are passed in', () => {
      const fields: FieldType[] = [
        {
          name: 'name',
          type: 'select',
          options: [],
        },
      ];
      const result = setFieldOptions('name', [])(fields);
      expect(result).toEqual(fields);
    });

    it('returns a field with options', () => {
      const options: any = [
        { value: 1, label: 'First' },
        { value: 2, label: 'second' },
      ];
      const field: FieldType = {
        name: 'name',
        type: 'select',
        options: [],
      };
      const result = setFieldOptions('name', options)([field]);
      expect(result).toEqual([{ ...field, options }]);
    });

    it('set options on nested field', () => {
      const options: any = [
        { value: 1, label: 'First' },
        { value: 2, label: 'second' },
      ];
      const fields: FieldType[] = [
        {
          type: 'group',
          name: 'groups',
          fields: [
            {
              type: 'group',
              name: 'group-1',
              fields: [
                {
                  name: 'select-1',
                  type: 'select',
                  options: [],
                },
              ],
            },
          ],
        },
      ];

      const resultFields: FieldType[] = [
        {
          type: 'group',
          name: 'groups',
          fields: [
            {
              type: 'group',
              name: 'group-1',
              fields: [
                {
                  name: 'select-1',
                  type: 'select',
                  options,
                },
              ],
            },
          ],
        },
      ];

      const result = setFieldOptions(['groups', 'group-1', 'select-1'], options, fields);
      expect(result).toEqual(resultFields);
    });

    it('set options on nested field but not the last nested one', () => {
      const options: any = [
        { value: 1, label: 'First' },
        { value: 2, label: 'second' },
      ];
      const fields: FieldType[] = [
        {
          type: 'group',
          name: 'groups',
          fields: [
            {
              type: 'group',
              name: 'group-1',
              fields: [
                {
                  name: 'select-1',
                  type: 'select',
                },
              ],
            },
            {
              name: 'select-2',
              type: 'select',
              options,
            },
          ],
        },
      ];

      const result = setFieldOptions('select-2', options, fields);
      expect(result).toEqual(fields);
    });
  });

  describe('update', () => {
    it('updates a structure', () => {
      const name = 'a';
      const value = 'valueA';

      expect(update({ name, value }, [])).toEqual([]);

      const differentFields: FieldType[] = [{ name: 'b', type: 'text' }];

      expect(update({ name, value }, differentFields)).toEqual(differentFields);

      expect(update({ name, value }, [{ name: 'a', type: 'text' }])).toEqual([{ name: 'a', type: 'text', value }]);
    });

    it('updates a grouped structure', () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text' },
          ],
        },
      ];

      const value = 'value X';
      const expected: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text', value },
            { name: 'd', type: 'text' },
          ],
        },
      ];

      expect(update({ name: 'c', groupName: 'groupA', value }, fields)).toEqual(expected);
    });

    it('updates a nested grouped structure', () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            {
              name: 'groupD',
              type: 'group',
              fields: [
                { name: 'e', type: 'text' },
                { name: 'f', type: 'text' },
              ],
            },
          ],
        },
      ];

      const value = 'value Y';
      const expected: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            {
              name: 'groupD',
              type: 'group',
              fields: [
                { name: 'e', type: 'text' },
                { name: 'f', type: 'text', value },
              ],
            },
          ],
        },
      ];

      expect(update({ name: 'f', groupName: 'groupD', value }, fields)).toEqual(expected);
    });
  });

  describe('getFieldValue', () => {
    it('gets the right value', () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text', value: 'a value' },
        { name: 'b', type: 'text' },
        {
          name: 'c',
          type: 'group',
          fields: [{ name: 'd', value: 'd value', type: 'text' }],
        },
        { name: 'e', type: 'checkbox', value: false },
      ];

      expect(getFieldValue<string>('a', fields)).toEqual('a value');
      expect(getFieldValue('b', fields)).toEqual(undefined);
      expect(getFieldValue('c', fields)).toEqual({ d: 'd value' });
      expect(getFieldValue('d')(fields)).toEqual(undefined);
      expect(getFieldValue('e')(fields)).toEqual(false);
    });
  });

  describe('validate', () => {
    const errorMessage = 'This field is required.';
    const validation = [
      {
        type: 'required',
        message: errorMessage,
      },
    ];

    it('validates a structure', () => {
      expect(validate({ name: 'a' }, [])).toEqual([]);
      expect(validate({ name: 'a' }, [{ name: 'b', validation } as FieldType])).toEqual([{ name: 'b', validation }]);
      expect(validate({ name: 'b' }, [{ name: 'b', validation } as FieldType])).toEqual([
        {
          name: 'b',
          validation,
          errorMessage,
        },
      ]);
    });

    it('validates a nested structure', () => {
      const fields: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text', validation },
          ] as FieldType[],
        },
      ];

      const expected: FieldType[] = [
        { name: 'a', type: 'text' },
        {
          name: 'groupA',
          type: 'group',
          fields: [
            { name: 'c', type: 'text' },
            { name: 'd', type: 'text', validation, errorMessage },
          ] as FieldType[],
        },
      ];

      expect(validate({ name: 'd' }, fields)).toEqual(expected);
    });
  });
});
