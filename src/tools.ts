import { MaxLength, MinLength, Pattern, Required } from './types';

export const required = (message: string): Required => ({
  type: 'required',
  rules: [
    {
      message,
    },
  ],
});

export const minlength = (message: string, value: number): MinLength => ({
  type: 'minlength',
  rules: [
    {
      value,
      message,
    },
  ],
});

export const maxlength = (message: string, value: number): MaxLength => ({
  type: 'maxlength',
  rules: [
    {
      value,
      message,
    },
  ],
});

export const pattern = (message: string, value: string): Pattern => ({
  type: 'pattern',
  rules: [
    {
      value,
      message,
    },
  ],
});

export const notpattern = (message: string, value: string) => ({
  type: 'notpattern',
  rules: [
    {
      value,
      message,
    },
  ],
});

export const mustnotcontain = (message: string, value: string) => ({
  type: 'mustnotcontain',
  rules: [
    {
      value,
      message,
    },
  ],
});

export const mustmatch = (message: string, value: string) => ({
  type: 'mustmatch',
  rules: [
    {
      value,
      message,
    },
  ],
});
