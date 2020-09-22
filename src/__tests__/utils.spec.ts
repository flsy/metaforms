import { hasError, isRequired, setFieldValue, update, validate, validateForm } from '../utils';
import { Form, required, Validation } from '..';

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
      expect(hasError({})).toEqual(false);
      expect(hasError({ name: { type: 'text', errorMessage: '' } })).toEqual(false);
      expect(hasError({ name: { type: 'text', errorMessage: undefined } })).toEqual(false);
      expect(hasError({ name: { type: 'text', errorMessage: 'error' } })).toEqual(true);

      const fields = { group1: { type: 'group', fields: { name: { type: 'text', errorMessage: 'yes error' } } } };
      expect(hasError(fields)).toEqual(true);
    });
  });

  describe('validateForm', () => {
    const message = 'This field is required error message';
    it('validates a form', () => {
      const form: Form<any> = {
        myField: {
          type: 'text',
          validation: [
            {
              type: 'required',
              message,
            },
          ],
        },
        yourField: {
          type: 'text',
        },
      };

      expect(validateForm(form).myField.errorMessage).toEqual(message);
      expect(validateForm(form).yourField.errorMessage).toEqual(undefined);
    });

    it('validates a field with more validations', () => {
      const fields: Form<any> = {
        myField: {
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
      };

      expect(validateForm(fields).myField.errorMessage).toEqual('min 3 characters');
    });
  });

  describe('setFieldValue', () => {
    it('sets a value on exact field', () => {
      const fields: Form<any> = { name: { value: 'a' }, surname: { value: 'b' } };

      expect(setFieldValue('name', 'hey yo!')(fields).name.value).toEqual('hey yo!');
      expect(fields.surname.value).toEqual('b');
      expect(setFieldValue('surname', 'b yo!')(fields).surname.value).toEqual('b yo!');
    });

    it('sets a numeric value', () => {
      const fields: Form<any> = { name: {} };

      expect(setFieldValue('name', 12)(fields).name.value).toEqual(12);
    });

    it('sets a value on nested fields', () => {
      const fields: Form<any> = {
        a: { type: 'text' },
        b: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text' },
          },
        },
      };

      const updated = setFieldValue(['b', 'c'], 'value C')(fields);

      expect(updated).toEqual({
        a: { type: 'text' },
        b: {
          type: 'group',
          fields: {
            c: { type: 'text', value: 'value C' },
            d: { type: 'text' },
          },
        },
      });
    });

    it("shouldn't set a value to nested field without groupName", () => {
      const fields: Form<any> = {
        a: { type: 'text' },
        b: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text' },
          },
        },
      };

      const updated = setFieldValue('c', 'value C')(fields);

      expect(updated).toEqual({
        a: { type: 'text' },
        b: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text' },
          },
        },
      });
    });
  });

  describe('update', () => {
    it('updates a structure', () => {
      const name = 'a';
      const value = 'valueA';

      expect(update(name, value, {})).toEqual({});

      const differentFields: Form<any> = { b: { type: 'text' } };

      expect(update('a', value, differentFields)).toEqual(differentFields);

      expect(update('a', value, { a: { type: 'text' } })).toEqual({ a: { type: 'text', value } });
    });

    it('updates a grouped structure', () => {
      const fields: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text' },
          },
        },
      };

      const value = 'value X';
      const expected: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text', value },
            d: { type: 'text' },
          },
        },
      };

      expect(update(['groupA', 'c'], value, fields)).toEqual(expected);
    });

    it('updates a nested grouped structure', () => {
      const fields: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            groupD: {
              type: 'group',
              fields: {
                e: { type: 'text' },
                f: { type: 'text' },
              },
            },
          },
        },
      };

      const value = 'value Y';
      const expected: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            groupD: {
              type: 'group',
              fields: {
                e: { type: 'text' },
                f: { type: 'text', value },
              },
            },
          },
        },
      };

      expect(update(['groupA', 'groupD', 'f'], value, fields)).toEqual(expected);
    });
  });

  describe('validate', () => {
    const errorMessage = 'This field is required.';
    const validation: Validation[] = [
      {
        type: 'required',
        message: errorMessage,
      },
    ];

    it('validates a structure', () => {
      expect(validate('a', {})).toEqual({});
      expect(validate('a', { b: { type: 'text', validation } })).toEqual({ b: { type: 'text', validation } });
      expect(validate('b', { b: { type: 'text', validation } })).toEqual({
        b: {
          type: 'text',
          validation,
          errorMessage,
        },
      });
    });

    it('validates a nested structure', () => {
      const fields: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text', validation },
          },
        },
      };

      const expected: Form<any> = {
        a: { type: 'text' },
        groupA: {
          type: 'group',
          fields: {
            c: { type: 'text' },
            d: { type: 'text', validation, errorMessage },
          },
        },
      };

      expect(validate(['groupA', 'd'], fields)).toEqual(expected);
    });
  });
});
