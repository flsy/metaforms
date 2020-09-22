import { InList, IsNumber, Max, MaxLength, Min, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, MustNotContain, NotPattern, Optional, Pattern, Required } from './interfaces';
import { Field, FieldBody, FormData } from '../interfaces';

const isString = (value: any): value is string => typeof value === 'string';
const isNumber = (value: any): value is number => typeof value === 'number';
const parseNumber = (value: any): Optional<number> => {
  if (!value) {
    return undefined;
  }

  if (isString(value)) {
    return parseInt(value, 10);
  }

  if (isNumber(value)) {
    return value;
  }
  return undefined;
};

const isEmpty = <Value extends unknown>(value: Value, rule: Required): Optional<string> => (value === null || value === undefined || value === '' ? rule.message : undefined);

const getErrorIfDoesNotMatchRegEx = <Value>(value: Value, rule: Pattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) === null ? rule.message : undefined;
  }
  return undefined;
};

const getErrorIfMatchesRegEx = <Value>(value: Value, rule: NotPattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) !== null ? rule.message : undefined;
  }
  return undefined;
};

const isLessThanMin = <Value>(value: Value, rule: Min): Optional<string> => {
  const parsedNumber = parseNumber(value);
  if (!parsedNumber) {
    return undefined;
  }

  return parsedNumber < rule.value ? rule.message : undefined;
};

const isGreaterThanMax = <Value>(value: Value, rule: Max): Optional<string> => {
  const parsedNumber = parseNumber(value);
  if (!parsedNumber) {
    return undefined;
  }

  return parsedNumber > rule.value ? rule.message : undefined;
};

const validateIsNumber = <Value>(value: Value, rule: IsNumber): Optional<string> => (value && !isNumber(value) ? rule.message : undefined);

const isNotEqualToExpectedValue = (value: any, rule: MustBeEqual): Optional<string> => (value !== rule.value ? rule.message : undefined);

const isInList = <Value>(value: any, rule: InList): Optional<string> => (!rule.value.includes(value) ? rule.message : undefined);

const isGreaterThanMaxLength = <Value>(value: Value, rule: MaxLength): Optional<string> => (isString(value) && value.length > rule.value ? rule.message : undefined);

const isLessThanMinLength = <Value>(value: Value, rule: MinLength): Optional<string> => (isString(value) && value.length < rule.value ? rule.message : undefined);

const mustMatch = <Value, Form extends Field>(value: Value, rule: MustMatch, formData: FormData<Form>): Optional<string> => (formData[rule.value] && formData[rule.value] !== value ? rule.message : undefined);

const mustNotContain = <Value, Form extends Field>(value: Value, rule: MustNotContain, formData: FormData<Form>): Optional<string> => {
  const data = formData[rule.value];
  if (data && isString(data) && isString(value)) {
    return value.toLowerCase().includes(data.toLowerCase()) ? rule.message : undefined;
  }
};

const equalIgnoreCase = (a?: string, b?: string) => a && b && a.toLowerCase() === b.toLowerCase();

const mustMatchCaseInsensitive = <Value, Form extends Field>(value: Value, rule: MustMatchCaseInsensitive, formData: FormData<Form>): Optional<string> => {
  const target = formData[rule.value];
  return isString(value) && isString(target) && !equalIgnoreCase(target, value) ? rule.message : undefined;
};

export const validateField = <T extends Field, Value = unknown>(formData: FormData<T>, field: Partial<FieldBody>): Optional<string> => {
  const errorMessages = (field.validation || [])
    .map((rule) => {
      switch (rule.type) {
        case 'required':
          return isEmpty(field.value, rule);

        case 'minlength':
          return isLessThanMinLength(field.value, rule);

        case 'maxlength':
          return isGreaterThanMaxLength(field.value, rule);

        case 'mustbeequal':
          return isNotEqualToExpectedValue(field.value, rule);

        case 'inlist':
          return isInList(field.value, rule);

        case 'pattern':
          return getErrorIfDoesNotMatchRegEx(field.value, rule);

        case 'notpattern':
          return getErrorIfMatchesRegEx(field.value, rule);

        case 'mustmatch':
          return mustMatch(field.value, rule, formData);

        case 'mustmatchcaseinsensitive':
          return mustMatchCaseInsensitive(field.value, rule, formData);

        case 'mustnotcontain':
          return mustNotContain(field.value, rule, formData);

        case 'min':
          return isLessThanMin(field.value, rule);

        case 'max':
          return isGreaterThanMax(field.value, rule);

        case 'isNumber':
          return validateIsNumber(field.value, rule);

        default:
          return undefined;
      }
    })
    .filter((error) => error && error !== null);

  return errorMessages.length > 0 ? errorMessages[0] : undefined;
};
