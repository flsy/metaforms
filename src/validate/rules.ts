import { InList, MaxLength, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, NotPattern, Pattern, Required, Value } from './interfaces';

export const required = (message: string): Required => ({
  type: 'required',
  rules: [
    {
      message,
    },
  ],
});

export const minlength = (...rules: Array<{ message: string; value: number }>): MinLength => ({
  type: 'minlength',
  rules,
});

export const maxlength = (...rules: Array<{ message: string; value: number }>): MaxLength => ({
  type: 'maxlength',
  rules,
});

export const pattern = (...rules: Array<{ message: string; value: string }>): Pattern => ({
  type: 'pattern',
  rules,
});

export const notpattern = (...rules: Array<{ message: string; value: string }>): NotPattern => ({
  type: 'notpattern',
  rules,
});

export const mustnotcontain = (...rules: Array<{ message: string; value: string }>) => ({
  type: 'mustnotcontain',
  rules,
});

export const mustmatch = (...rules: Array<{ message: string; value: string }>): MustMatch => ({
  type: 'mustmatch',
  rules,
});

export const mustmatchcaseinsensitive = (...rules: Array<{ message: string; value: string }>): MustMatchCaseInsensitive => ({
  type: 'mustmatchcaseinsensitive',
  rules,
});

export const mustbeequal = (...rules: Array<{ message: string; value: string | boolean }>): MustBeEqual => ({
  type: 'mustbeequal',
  rules,
});

export const inList = (...rules: Array<{ message: string; value: Value[] }>): InList => ({
  type: 'inlist',
  rules,
});
