import { FieldType, GroupProps } from './interfaces';

export const isGroupField = (field: FieldType): field is GroupProps => field.type === 'group';
