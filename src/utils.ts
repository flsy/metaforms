import { find, head, Optional, propEq } from 'fputils';
import { Validation } from './validate/interfaces';
import { Field, FieldBody, Form, FormData } from './interfaces';
import { validateField } from './validate/validate';
import { required } from './validate/rules';

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

const fieldNameWithError = <T extends Field>(form: Form<T>): Optional<string> => Object.keys(form).find((name) => form[name].errorMessage);
const fieldNameWithoutValue = <T extends Field>(form: Form<T>): Optional<string> => Object.keys(form).find((name) => !form[name].value);

/**
 * returns a name of field
 * @param form
 */
export const shouldComponentFocus = <T extends Field>(form: Form<T>): Optional<string> => {
  const errorField = fieldNameWithError(form);
  if (errorField) {
    return errorField;
  }

  return fieldNameWithoutValue(form);
};

/**
 *
 * @param {Form} form
 */
export const getFormData = <T extends Field>(form: Form<T>): FormData<T> =>
  Object.entries<FieldBody>(form).reduce<FormData<T>>((all, [name, field]) => {
    if (field.fields) {
      const nested = getFormData(field.fields);
      if (Object.keys(nested).length) {
        return { ...all, [name]: nested };
      }
      return { ...all };
    }
    if (field.value) {
      return { ...all, [name]: field.value };
    }
    return all;
  }, {} as FormData<any>);

const updateFunction = <D extends { type: string; fields?: any }, R extends D>(name: string | string[], fn: (field: D) => R) => (form: Form<{ [name: string]: D }>): Form<{ [name: string]: R }> =>
  Object.entries(form).reduce((all, [key, field]) => {
    if (Array.isArray(name)) {
      if (name.length === 1 && key === name[0]) {
        return { ...all, [key]: { ...field, ...fn(field) } };
      }
      if (name.length > 1 && key === name[0] && field.fields) {
        const [, ...rest] = name;
        return { ...all, [key]: { ...field, fields: updateFunction(rest, fn)(field.fields) } };
      }
    }
    if (key === name) {
      return { ...all, [key]: { ...field, ...fn(field) } };
    }
    return { ...all, [key]: field };
  }, {});

export const setFieldOptions = <Option>(name: string | string[], options: Option[]) => updateFunction(name, (field) => ({ ...field, options }));
export const setFieldValue = <Value>(name: string | string[], value: Value) => updateFunction(name, (field) => ({ ...field, value }));
export const setFieldValues = (name: string | string[], values: number[] | string[]) => updateFunction(name, (field) => ({ ...field, values }));

export const addFieldIntoGroup = <T extends { [name: string]: { type: string; fields?: Form<T> } }, F extends { type: string }>(groupName: string, newFieldName: string, newField: F) => (form: Form<T>): Form<T> => {
  return Object.entries(form).reduce((all, [key, field]) => {
    if ('fields' in field) {
      if (key === groupName) {
        return { ...all, [key]: { ...field, fields: { ...field.fields, [newFieldName]: newField } } };
      }
      return { ...all, [key]: { ...field, fields: addFieldIntoGroup(groupName, newFieldName, newField)(field.fields as any) } };
    }
    return { ...all, [key]: field };
  }, {} as Form<T>);
};

/**
 *
 * @param {Form} form
 */
export const hasError = <T extends Field>(form: Form<T>): boolean =>
  !!Object.values(form).find((field) => {
    if (field.fields) {
      return hasError(field.fields);
    }
    return !!field.errorMessage;
  });

export const validateForm = <T extends Field>(form: Form<T>): Form<T> =>
  Object.entries(form).reduce((all, [key, field]) => {
    const errorMessage = validateField(getFormData(form) as any, field);
    if (field.fields) {
      return { ...all, [key]: { ...field, fields: validateForm(field.fields) } };
    }

    return { ...all, [key]: { ...field, errorMessage } };
  }, {} as Form<T>);

export const update = <T extends Field, Value>(path: string | string[], value: Value, form: Form<T>) => setFieldValue(path, value)(form);
export const validate = <T extends Field>(name: string | string[], form: Form<T>) => updateFunction(name, (field) => ({ ...field, errorMessage: validateField(getFormData(form), field) }))(form);
export const updateAndValidate = <T extends Field, Value>(path: string | string[], value: Value, form: Form<T>) =>
  updateFunction(path, (field) => ({ ...field, value, errorMessage: validateField(getFormData(form), { ...field, value }) }))(form);
