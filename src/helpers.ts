import { FieldType, GroupProps } from './interfaces';
import { Optional } from 'fputils';

export const isGroupField = (field: FieldType): field is GroupProps => field.type === 'group';

export const addFieldIntoGroup = (groupName: string, field: FieldType) => (fields: FieldType[]): FieldType[] => {
  return fields.map(f => {
    if (f.name === groupName) {
      return { ...f, fields: [...f.fields!, field] };
    }

    if (isGroupField(f)) {
      return { ...f, fields: addFieldIntoGroup(groupName, field)(f.fields) };
    }
    return f;
  });
};

export const getFieldByName = (name: string, fields: FieldType[]): Optional<FieldType> =>
  fields.reduce<Optional<FieldType>>((previous, current) => {
    if (previous) {
      return previous;
    }
    if (current.name === name) {
      return current;
    }
    if (isGroupField(current)) {
      return getFieldByName(name, current.fields);
    }
  }, undefined);

export const renameField = (newName: string, currentName: string) => (field: FieldType): FieldType => {
  if (field.name === currentName) {
    return { ...field, name: newName };
  }

  if (isGroupField(field)) {
    return { ...field, fields: field.fields.map(f => renameField(newName, currentName)(f)) };
  }

  return field;
};

export const removeField = (name: string, fields: FieldType[]): FieldType[] =>
  fields.reduce<FieldType[]>((all, field) => {
    if (field.name === name) {
      return all;
    }

    if (isGroupField(field)) {
      return [...all, { ...field, fields: removeField(name, field.fields) }];
    }

    return [...all, field];
  }, []);

export const fieldExists = (name: string, fields: FieldType[]): boolean => {
  const exists = fields.find(field => {
    if (field.name === name) {
      return true;
    }

    if (isGroupField(field)) {
      return fieldExists(name, field.fields);
    }

    return false;
  });
  return !!exists;
};
