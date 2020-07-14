import { assoc, compose, curry, find, foldr, head, lensProp, map, prop, propEq, set, view } from 'fputils';
import { Optional, Validation } from './validate/interfaces';
import { FieldType, UpdateActionType, UpdateAndValidateActionType, ValidateActionType } from './interfaces';
import { validateField } from './validate/validate';
import { isGroupField } from './helpers';
import { required } from './validate/rules';

const valueLens = lensProp('value');
const optionsLens = lensProp('options');
const valuesLens = lensProp('values');
const errorMessageLens = lensProp('errorMessage');

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

export const hasError = (fields: FieldType[]): boolean => !!find((field) => (field.fields ? hasError(field.fields) : !!prop('errorMessage', field)), fields);

const hasFieldError = (field: FieldType): boolean => !!prop('errorMessage', field);

const findFieldWithError = (fields: FieldType[]) => find(hasFieldError, fields);

export const shouldComponentFocus = (fields: FieldType[]): Optional<string> => {
  const errorField = findFieldWithError(fields);
  if (errorField) {
    return errorField.name;
  }

  // todo: find first empty field
  const firstField = head(fields);
  return firstField && firstField.name;
};

export const getFormData = <Name extends FieldType['name']>(fields: FieldType[]): { [key in Name]: FieldType['value'] } =>
  foldr((field, all) => (field.fields ? { ...all, [field.name]: getFormData(field.fields) } : assoc(field.name, field.value, all)), {}, fields);

const clearField = (field: FieldType): FieldType => {
  if (propEq('errorMessage', null, field)) {
    const { errorMessage, ...rest } = field;
    return rest;
  }

  if (propEq('errorMessage', undefined, field)) {
    const { errorMessage, ...rest } = field;
    return rest;
  }

  return field;
};

export const validateForm = (fields: FieldType[]): FieldType[] =>
  map((field) => {
    const error = validateField(getFormData(fields), field);
    if (isGroupField(field)) {
      return { ...field, fields: validateForm(field.fields) };
    }

    return compose(clearField, set(errorMessageLens, error))(field);
  }, fields);

type IUpdateField = (name: string | string[], fn: <Val>(value: Val) => Val, fields: FieldType[]) => FieldType[];

export const updateField: IUpdateField = (name, fn, fields): FieldType[] =>
  map((field) => {
    if (typeof name === 'string' && field.name === name) {
      return fn(field);
    } else if (Array.isArray(name) && name.length === 1 && field.name === name[0]) {
      return fn(field);
    } else if (Array.isArray(name) && name.length > 1 && field.name === name[0]) {
      const [groupName, ...rest] = name;
      const group = fields.find((f) => f.name === groupName);
      const updatedFields = updateField(rest, fn, group?.fields ?? []);
      return { ...field, fields: updatedFields };
    }

    return field;
  }, fields);

export interface GetFieldValue {
  <Val>(name: string, fields: FieldType[]): Optional<Val>;

  <Val>(name: string): (fields: FieldType[]) => Optional<Val>;
}

export const getFieldValue: GetFieldValue = curry((name, fields) => view(lensProp(name), getFormData(fields)));

type SetFieldValue = <Val>(name: string | string[], value: Val, fields: FieldType[]) => FieldType[];

export interface SetFieldValueCurried {
  <Val>(name: string | string[], value: Val, fields: FieldType[]): FieldType[];

  <Val>(name: string | string[], value: Val): (fields: FieldType[]) => FieldType[];
}

export const setFieldValue: SetFieldValueCurried = curry<SetFieldValue>((name, value, fields): FieldType[] => updateField(name, set(valueLens, value), fields));

export interface Option<T> {
  value: T;
  label?: string;
}

export type SetFieldOptions = <Val>(name: string | string[], options: Option<Val>[], fields: FieldType[]) => FieldType[];

export interface SetFieldOptionsCurried {
  <Val>(name: string | string[], options: Option<Val>[], fields: FieldType[]): FieldType[];

  <Val>(name: string | string[], options: Option<Val>[]): (fields: FieldType[]) => FieldType[];
}

export const setFieldOptions: SetFieldOptionsCurried = curry<SetFieldOptions>((name, options, fields) => updateField(name, set(optionsLens, options), fields));

type SetFieldValues = (name: string | string[], value: number[] | string[], fields: FieldType[]) => FieldType[];

export interface SetFieldValuesCurried {
  (name: string | string[], value: number[] | string[], fields: FieldType[]): FieldType[];

  (name: string | string[], value: number[] | string[]): (fields: FieldType[]) => FieldType[];
}

export const setFieldValues: SetFieldValuesCurried = curry<SetFieldValues>((name, value, fields): FieldType[] => updateField(name, set(valuesLens, value), fields));

export const update = ({ value, name, groupName }: UpdateActionType, fields: FieldType[]): FieldType[] =>
  map((field) => {
    if (groupName && isGroupField(field)) {
      return { ...field, fields: update({ value, name, groupName }, field.fields) };
    } else if (field.name === name) {
      return { ...field, value } as FieldType;
    } else {
      return field;
    }
  }, fields);

export const validate = ({ name }: ValidateActionType, fields: FieldType[]): FieldType[] => {
  return map((field) => {
    if (isGroupField(field)) {
      return { ...field, fields: validate({ name }, field.fields) };
    }
    if (field.name === name) {
      const errorMessage = validateField(getFormData(fields), field);
      return { ...field, errorMessage };
    }

    return field;
  }, fields);
};

export const updateAndValidate = ({ name, value, groupName }: UpdateAndValidateActionType, fields: FieldType[]): FieldType[] => {
  return map((field) => {
    if (groupName && isGroupField(field)) {
      return { ...field, fields: updateAndValidate({ name, value, groupName }, field.fields) };
    } else if (field.name === name) {
      const errorMessage = validateField(getFormData(fields), { ...field, value });
      return { ...field, value, errorMessage } as FieldType;
    } else {
      return field;
    }
  }, fields);
};
