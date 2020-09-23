import { find, Optional, propEq } from 'fputils';
import { Validation } from './validate/interfaces';
import { Field, FieldBody, IForm, FormData } from './interfaces';
import { validateField } from './validate/validate';

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

const fieldNameWithError = <T extends Field>(form: IForm<T>): Optional<string> => Object.keys(form).find((name) => form[name].errorMessage);
const fieldNameWithoutValue = <T extends Field>(form: IForm<T>): Optional<string> => Object.keys(form).find((name) => !form[name].value);

/**
 * returns a name of field
 *
 * @param form
 */
export const shouldComponentFocus = <T extends Field>(form: IForm<T>): Optional<string> => {
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
export const getFormData = <T extends Field>(form: IForm<T>): FormData<T> =>
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

const updateFunction = <D extends Field>(name: keyof D | string[], fn: (field: FieldBody) => FieldBody) => (form: IForm<D>): IForm<D> =>
  Object.entries(form).reduce<D>((all, [key, field]) => {
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
export const setFieldValues = (name: string | string[], values: number[] | string[]) => updateFunction(name, (field) => ({ ...field, values }));

export const addFieldIntoGroup = <T extends { [name: string]: { type: string; fields?: IForm<T> } }, F extends { type: string }>(groupName: string, newFieldName: string, newField: F) => (form: IForm<T>): IForm<T> => {
  return Object.entries(form).reduce((all, [key, field]) => {
    if ('fields' in field) {
      if (key === groupName) {
        return { ...all, [key]: { ...field, fields: { ...field.fields, [newFieldName]: newField } } };
      }
      return { ...all, [key]: { ...field, fields: addFieldIntoGroup(groupName, newFieldName, newField)(field.fields as any) } };
    }
    return { ...all, [key]: field };
  }, {} as IForm<T>);
};

/**
 *
 * @param {IForm} form
 */
export const hasError = <T extends Field>(form: IForm<T>): boolean =>
  !!Object.values(form).find((field) => {
    if (field.fields) {
      return hasError(field.fields);
    }
    return !!field.errorMessage;
  });

export const validateForm = <T extends Field>(form: IForm<T>): IForm<T> =>
  Object.entries(form).reduce((all, [key, field]) => {
    const errorMessage = validateField(getFormData(form) as any, field);
    if (field.fields) {
      return { ...all, [key]: { ...field, fields: validateForm(field.fields) } };
    }

    return { ...all, [key]: { ...field, errorMessage } };
  }, {} as IForm<T>);

export const update = <T extends Field, Value>(path: string | string[], value: Value, form: IForm<T>) => setFieldValue(path, value)(form);
export const validate = <T extends Field>(name: string | string[], form: IForm<T>) => updateFunction(name, (field) => ({ ...field, errorMessage: validateField(getFormData(form), field) }))(form);
export const updateAndValidate = <T extends Field, Value>(path: string | string[], value: Value, form: IForm<T>) =>
  updateFunction(path, (field) => ({ ...field, value, errorMessage: validateField(getFormData(form), { ...field, value }) }))(form);
