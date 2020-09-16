import { setFieldValue } from '../utils';
import { Form, GroupField, NumberField, TextField } from '../interfaces';

describe('setFieldValue', () => {
  it('set the value on simple path', () => {
    const form: Form<{ name: TextField }> = {
      name: {
        type: 'text',
      },
    };

    expect(setFieldValue('name', 'Joe')(form)).toEqual({
      name: {
        type: 'text',
        value: 'Joe',
      },
    });
  });

  it('set the value on simple path defined by string array', () => {
    const form: Form<{ name: TextField }> = {
      name: {
        type: 'text',
      },
    };

    expect(setFieldValue(['name'], 'Joe')(form)).toEqual({
      name: {
        type: 'text',
        value: 'Joe',
      },
    });
  });

  it('set the value on nested path', () => {
    const form: Form<{ name: GroupField<{ firstName: TextField }> }> = {
      name: {
        type: 'group',
        fields: {
          firstName: {
            type: 'text',
          },
        },
      },
    };

    expect(setFieldValue(['name', 'firstName'], 'Joe')(form)).toEqual({
      name: {
        type: 'group',
        fields: {
          firstName: {
            type: 'text',
            value: 'Joe',
          },
        },
      },
    });
  });

  it('set values on two fields', () => {
    const form: Form<{ name: TextField; age: NumberField }> = {
      name: {
        type: 'text',
      },
      age: {
        type: 'number',
      },
    };

    const res1 = setFieldValue(['name'], 'Joe')(form);
    const res2 = setFieldValue(['age'], 32)(res1);

    expect(res1).toEqual({
      name: {
        type: 'text',
        value: 'Joe',
      },
      age: {
        type: 'number',
      },
    });

    expect(res2).toEqual({
      name: {
        type: 'text',
        value: 'Joe',
      },
      age: {
        type: 'number',
        value: 32,
      },
    });
  });
});
