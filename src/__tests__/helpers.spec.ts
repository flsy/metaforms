import { addFieldIntoGroup, getFieldByName, removeField, renameField } from '../helpers';
import { FieldType } from '../interfaces';

describe('group helpers', () => {
  const textField: FieldType = {
    name: 'new-field',
    type: 'text',
  };

  const fields: FieldType[] = [
    {
      type: 'text',
      name: 'name',
    },
    {
      type: 'group',
      name: 'groups',
      fields: [],
    },
  ];

  const nestedFields: FieldType[] = [
    {
      type: 'text',
      name: 'name',
    },
    {
      type: 'group',
      name: 'groups',
      fields: [textField],
    },
  ];

  const nestedGroup: FieldType[] = [
    textField,
    {
      type: 'group',
      name: 'group1',
      fields: nestedFields,
    },
  ];

  describe('addGroup', () => {
    it('does nothing by default', () => {
      const result = addFieldIntoGroup('', textField)([]);
      expect(result).toEqual([]);
    });

    it('add a group into current fields', () => {
      const result = addFieldIntoGroup('groups', textField)(fields);
      expect(result).toEqual(nestedFields);
    });
    it('add a group into nested fields', () => {
      const field: FieldType = { type: 'button', name: 'butt', label: 'Butt' };
      const expected: FieldType[] = [
        textField,
        {
          type: 'group',
          name: 'group1',
          fields: [
            {
              type: 'text',
              name: 'name',
            },
            {
              type: 'group',
              name: 'groups',
              fields: [textField, field],
            },
          ],
        },
      ];

      const result = addFieldIntoGroup('groups', field)(nestedGroup);

      expect(result).toEqual(expected);
    });
  });

  describe('getFieldByName', () => {
    it('returns undefined by default', () => {
      expect(getFieldByName('field1', [])).toEqual(undefined);
    });

    it('returns a field when found', () => {
      expect(getFieldByName('groups', fields)).toEqual(fields[1]);
    });

    it('returns a nested field', () => {
      expect(getFieldByName('new-field', nestedFields)).toEqual(textField);
    });
  });

  describe('renameField', () => {
    it('does nothing when no field found', () => {
      expect(renameField('aa', 'xx')(textField)).toEqual(textField);
    });

    it('renames the field', () => {
      expect(renameField('new name', 'new-field')(textField)).toEqual({ ...textField, name: 'new name' });
    });

    it('renames nested field', () => {
      const expected: FieldType = {
        type: 'group',
        name: 'groups',
        fields: [
          {
            name: 'my name',
            type: 'text',
          },
        ],
      };
      expect(renameField('my name', 'new-field')(nestedFields[1])).toEqual(expected);
    });
  });

  describe('removeField', () => {
    it('returns same fields when no fields passed in', () => {
      expect(removeField('xxx', [])).toEqual([]);
    });

    it('returns same fields when no field found', () => {
      expect(removeField('not-found', fields)).toEqual(fields);
    });

    it('removes one field', () => {
      const expected: FieldType[] = [fields[1]];
      expect(removeField('name', fields)).toEqual(expected);
    });

    it('removes a group field', () => {
      const expected: FieldType[] = [fields[0]];
      expect(removeField('groups', fields)).toEqual(expected);
    });

    it('removes a nested field', () => {
      const expected: FieldType[] = [
        {
          type: 'text',
          name: 'name',
        },
        {
          type: 'group',
          name: 'groups',
          fields: [],
        },
      ];
      expect(removeField('new-field', nestedFields)).toEqual(expected);
    });
  });
});
