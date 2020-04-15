import { InList, MaxLength, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, Mustnotcontain, NotPattern, Pattern, Required, Value } from './interfaces';

export const required = (message: string): Required => ({
  type: 'required',
  rules: [
    {
      message,
    },
  ],
});

export const minlength = (...rules: { message: string; value: number }[]): MinLength => ({
  type: 'minlength',
  rules,
});

export const maxlength = (...rules: { message: string; value: number }[]): MaxLength => ({
  type: 'maxlength',
  rules,
});

export const pattern = (...rules: { message: string; value: string }[]): Pattern => ({
  type: 'pattern',
  rules,
});

export const notpattern = (...rules: { message: string; value: string }[]): NotPattern => ({
  type: 'notpattern',
  rules,
});

export const mustnotcontain = (...rules: { message: string; value: string }[]): Mustnotcontain => ({
  type: 'mustnotcontain',
  rules,
});

export const mustmatch = (...rules: { message: string; value: string }[]): MustMatch => ({
  type: 'mustmatch',
  rules,
});

export const mustmatchcaseinsensitive = (...rules: { message: string; value: string }[]): MustMatchCaseInsensitive => ({
  type: 'mustmatchcaseinsensitive',
  rules,
});

export const mustbeequal = (...rules: { message: string; value: Value }[]): MustBeEqual => ({
  type: 'mustbeequal',
  rules,
});

export const inList = (...rules: { message: string; value: Value[] }[]): InList => ({
  type: 'inlist',
  rules,
});
