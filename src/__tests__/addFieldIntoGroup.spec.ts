import { IForm } from '../interfaces';
import { GroupField, TextField } from '../testInterfaces';
import { addFieldIntoGroup } from '../utils';

const field1: TextField = {
  type: 'text',
  value: 'hello',
};

const groupfield: GroupField<{}> = {
  type: 'group',
  fields: {},
};

const form: IForm<{ field1: TextField; myGroup: GroupField<{}> }> = {
  myGroup: groupfield,
  field1,
};

describe('addGroup', () => {
  it('does nothing by default', () => {
    const result = addFieldIntoGroup('myGroup', 'myField', {} as any)({});
    expect(result).toEqual({});
  });

  it('add a group into current fields', () => {
    const result = addFieldIntoGroup('myGroup', 'myField', field1)(form);
    expect(result).toEqual({
      field1: {
        type: 'text',
        value: 'hello',
      },
      myGroup: {
        type: 'group',
        fields: {
          myField: {
            type: 'text',
            value: 'hello',
          },
        },
      },
    });
  });

  it('add a group into nested fields', () => {
    const field: TextField = { type: 'text', value: 'my' };
    const form1: IForm<{ myGroup: GroupField<{ nestedGroup: GroupField<{}> }> }> = {
      myGroup: {
        type: 'group',
        fields: {
          nestedGroup: {
            type: 'group',
            fields: {},
          },
        },
      },
    };

    const result = addFieldIntoGroup('nestedGroup', 'nestedField', field)(form1);

    expect(result).toEqual({
      myGroup: {
        type: 'group',
        fields: {
          nestedGroup: {
            type: 'group',
            fields: {
              nestedField: {
                type: 'text',
                value: 'my',
              },
            },
          },
        },
      },
    });
  });
});
