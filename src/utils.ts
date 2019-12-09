import { lensProp, propEq, prop, head, assoc, compose, foldr, set, curry, map, view, find } from 'fputils';
import { FormData, Optional, Validation } from './validate/interfaces';
import { FieldType, UpdateActionType, UpdateAndValidateActionType, ValidateActionType } from './interfaces';
import { validateField } from './validate/validate';
import { isGroupField } from './helpers';

const valueLens = lensProp('value');
const errorMessageLens = lensProp('errorMessage');

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

export const hasError = (fields: FieldType[]): boolean => !!find(field => (field.fields ? hasError(field.fields) : !!prop('errorMessage', field)), fields);

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

export const getFormData = (fields: FieldType[]): FormData =>
  foldr<{}, FieldType, FormData>(
    (field, all) => {
      if (field.fields) {
        return { ...all, ...getFormData(field.fields) };
      }

      return assoc(field.name, field.value || null, all);
    },
    {},
    fields,
  );

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

export const validateForm = (fields: FieldType[]): FieldType[] => {
  const formData = getFormData(fields);

  return map(field => {
    const error = validateField(formData, field);
    if (field.fields) {
      return { ...field, fields: validateForm(field.fields) };
    }

    return compose(
      clearField,
      set(errorMessageLens, error),
    )(field);
  }, fields);
};

const updateField = curry((name: string, fn: <Val>(value: Val) => Val, fields: FieldType[]): FieldType[] =>
  map(field => {
    if (field.fields) {
      return { ...field, fields: updateField(name, fn, field.fields) };
    }

    if (field.name === name) {
      return fn(field);
    }

    return field;
  }, fields),
);

export interface GetFieldValue {
  <Val>(name: string, fields: FieldType[]): Optional<Val>;
  <Val>(name: string): (fields: FieldType[]) => Optional<Val>;
}
export const getFieldValue: GetFieldValue = curry((name, fields) => view(lensProp(name), getFormData(fields)) || undefined);

export interface SetFieldValue {
  <Val>(name: string, value: Val, fields: FieldType[]): FieldType[];
  <Val>(name: string, value: Val): (fields: FieldType[]) => FieldType[];
}
export const setFieldValue: SetFieldValue = curry((name: string, value: string, fields: FieldType[]): FieldType[] => updateField(name, set(valueLens, value), fields));

export const update = ({ value, name, groupName }: UpdateActionType, fields: FieldType[]): FieldType[] =>
  map(field => {
    if (groupName && isGroupField(field)) {
      return { ...field, fields: update({ value, name, groupName }, field.fields) };
    } else if (field.name === name) {
      return { ...field, value } as FieldType;
    } else {
      return field;
    }
  }, fields);

export const validate = ({ name }: ValidateActionType, fields: FieldType[]): FieldType[] => {
  const formData = getFormData(fields);
  return map(field => {
    if (isGroupField(field)) {
      return { ...field, fields: validate({ name }, field.fields) };
    }
    if (field.name === name) {
      const errorMessage = validateField(formData, field);
      return { ...field, errorMessage };
    }

    return field;
  }, fields);
};

export const updateAndValidate = ({ name, value, groupName }: UpdateAndValidateActionType, fields: FieldType[]): FieldType[] => {
  const formData = getFormData(fields);
  return map(field => {
    if (groupName && isGroupField(field)) {
      return { ...field, fields: updateAndValidate({ name, value, groupName }, field.fields) };
    } else if (field.name === name) {
      const errorMessage = validateField(formData, { ...field, value } as FieldType);
      return { ...field, value, errorMessage } as FieldType;
    } else {
      return field;
    }
  }, fields);
};
