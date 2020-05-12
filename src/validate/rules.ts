import { InList, MaxLength, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, Mustnotcontain, NotPattern, Pattern, Required, Value } from './interfaces';

type ValidationRule<T extends { value: Value[] | Value | number }> = (message: string, value: T['value']) => T;

export const required = (message: string): Required => ({
  type: 'required',
  message,
});

export const minlength: ValidationRule<MinLength> = (message, value) => ({
  type: 'minlength',
  message,
  value,
});

export const maxlength: ValidationRule<MaxLength> = (message, value) => ({
  type: 'maxlength',
  message,
  value,
});

export const pattern: ValidationRule<Pattern> = (message, value) => ({
  type: 'pattern',
  message,
  value,
});

export const notpattern: ValidationRule<NotPattern> = (message, value) => ({
  type: 'notpattern',
  message,
  value,
});

export const mustnotcontain: ValidationRule<Mustnotcontain> = (message, value) => ({
  type: 'mustnotcontain',
  message,
  value,
});

export const mustmatch: ValidationRule<MustMatch> = (message, value) => ({
  type: 'mustmatch',
  message,
  value,
});

export const mustmatchcaseinsensitive: ValidationRule<MustMatchCaseInsensitive> = (message, value) => ({
  type: 'mustmatchcaseinsensitive',
  message,
  value,
});

export const mustbeequal: ValidationRule<MustBeEqual> = (message, value) => ({
  type: 'mustbeequal',
  message,
  value,
});

export const inList: ValidationRule<InList> = (message, value): InList => ({
  type: 'inlist',
  message,
  value,
});
