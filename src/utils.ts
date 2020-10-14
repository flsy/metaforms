import { find, Optional, propEq } from 'fputils';
import { Validation } from './validate/interfaces';
import { Field, FieldBody, FormData } from './interfaces';
import { validateField } from './validate/validate';

const isNotEmpty = (value: any) => value !== null || value !== undefined;

const has = <T extends object>(property: keyof T, o?: T): boolean => !!(o && o[property]);

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

const fieldNameWithError = <T extends Field>(form: T): Optional<string> => Object.keys(form).find((name) => has('errorMessage', form[name]));
const fieldNameWithoutValue = <T extends Field>(form: T): Optional<string> => Object.keys(form).find((name) => !has('value', form[name]));

/**
 * returns a name of field
 *
 * @param form
 */
export const shouldComponentFocus = <T extends Field>(form: T): Optional<string> => {
  const errorField = fieldNameWithError(form);
  if (errorField) {
    return errorField;
  }

  return fieldNameWithoutValue(form);
};

/**
 *
 * @param {IForm} form
 */
export const getFormData = <T extends Field>(form: T): FormData<T> =>
  Object.entries(form).reduce<FormData<T>>((all, [name, field]) => {
    if (field && field.fields) {
      const nested = getFormData(field.fields);
      if (Object.keys(nested).length) {
        return { ...all, [name]: nested };
      }
      return { ...all };
    }
    if (field && isNotEmpty(field.value)) {
      return { ...all, [name]: field.value };
    }
    return all;
  }, {} as FormData<T>);

const updateFunction = <D extends Field>(name: keyof D | string[], fn: (field: FieldBody) => FieldBody) => (form: D): D =>
  Object.entries(form).reduce<D>((all, [key, field]) => {
    if (!field) {
      return all;
    }
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
  }, {} as any);

export const setFieldOptions = <Option>(name: string | string[], options: Option[]) => updateFunction(name, (field) => ({ ...field, options }));
export const setFieldValue = <Value>(name: string | string[], value: Value) => updateFunction(name, (field) => ({ ...field, value }));

export const addFieldIntoGroup = <T extends { [name: string]: { type: string; fields?: T } }, F extends { type: string }>(path: string, newFieldName: string, newField: F) => (form: T): T => {
  return Object.entries(form).reduce((all, [key, field]) => {
    if (field.fields) {
      if (key === path) {
        return { ...all, [key]: { ...field, fields: { ...field.fields, [newFieldName]: newField } } };
      }
      return { ...all, [key]: { ...field, fields: addFieldIntoGroup(path, newFieldName, newField)(field.fields) } };
    }
    return { ...all, [key]: field };
  }, {} as T);
};

/**
 *
 * @param {IForm} form
 */
export const hasError = <T extends Field>(form: T): boolean =>
  !!Object.values(form).find((field) => {
    if (field && field.fields) {
      return hasError(field.fields);
    }
    return field && !!field.errorMessage;
  });

export const validateForm = <T extends Field>(form: T): T =>
  Object.entries(form).reduce((all, [key, field]) => {
    if (!field) {
      return all;
    }
    const errorMessage = validateField(getFormData(form), field);
    if (field.fields) {
      return { ...all, [key]: { ...field, fields: validateForm(field.fields) } };
    }

    return { ...all, [key]: { ...field, errorMessage } };
  }, {} as T);

export const update = <T extends Field, Value>(path: string | string[], value: Value, form: T) => setFieldValue(path, value)(form);
export const validate = <T extends Field>(name: string | string[], form: T) => updateFunction(name, (field) => ({ ...field, errorMessage: validateField(getFormData(form), field) }))(form);
export const updateAndValidate = <T extends Field, Value>(path: string | string[], value: Value, form: T) =>
  updateFunction(path, (field) => ({ ...field, value, errorMessage: validateField(getFormData(form), { ...field, value }) }))(form);
