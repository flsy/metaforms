import { Form } from '../interfaces';
import { setFieldOptions } from '../utils';

interface Option {
  value: number;
  label: string;
}

export interface FieldWithOptions {
  type: 'myField';
  options: Option[];
}

const form: Form<{ field1: FieldWithOptions }> = {
  field1: {
    type: 'myField',
    options: [],
  },
};

describe('setFieldOptions', () => {
  it('set options on simple path', () => {
    const options = [{ value: 15, label: 'my label' }];
    expect(setFieldOptions('field1', options)(form)).toEqual({
      field1: {
        type: 'myField',
        options,
      },
    });
  });
});
