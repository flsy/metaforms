import { FormData, InList, MaxLength, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, Mustnotcontain, NotPattern, Optional, Pattern, Required, Validation, Value } from './interfaces';

const isString = (value: Value): value is string => typeof value === 'string';

const isEmpty = (value: Value, rule: Required): Optional<string> => (value === null || value === undefined || value === '' ? rule.message : undefined);

const getErrorIfDoesNotMatchRegEx = (value: Value, rule: Pattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) === null ? rule.message : undefined;
  }
  return undefined;
};

const getErrorIfMatchesRegEx = (value: Value, rule: NotPattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) !== null ? rule.message : undefined;
  }
  return undefined;
};

const isNotEqualToExpectedValue = (value: Value, rule: MustBeEqual): Optional<string> => (value !== rule.value ? rule.message : undefined);

const isInList = (value: Value, rule: InList): Optional<string> => (rule.value.indexOf(value) === -1 ? rule.message : undefined);

const isGreaterThanMaxLength = (value: Value, rule: MaxLength): Optional<string> => (isString(value) && value.length > rule.value ? rule.message : undefined);

const isLessThanMinLength = (value: Value, rule: MinLength): Optional<string> => (isString(value) && value.length < rule.value ? rule.message : undefined);

const mustMatch = (value: Value, rule: MustMatch, formData: FormData): Optional<string> => (formData[rule.value] && formData[rule.value] !== value ? rule.message : undefined);

const mustNotContain = (value: Value, rule: Mustnotcontain, formData: FormData): Optional<string> => {
  const data = formData[rule.value];
  if (data && isString(data) && isString(value)) {
    return value.toLowerCase().includes(data.toLowerCase()) ? rule.message : undefined;
  }
};

const equalIgnoreCase = (a?: string, b?: string) => a && b && a.toLowerCase() === b.toLowerCase();

const mustMatchCaseInsensitive = (value: Value, rule: MustMatchCaseInsensitive, formData: FormData): Optional<string> =>
  isString(value) && !equalIgnoreCase(formData[rule.value]?.toString(), value) ? rule.message : undefined;

interface IField {
  value?: Value;
  validation?: Validation[];
}

export const validateField = (formData: FormData, field: IField): Optional<string> => {
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

        default:
          return undefined;
      }
    })
    .filter((error) => error && error !== null);

  return errorMessages.length > 0 ? errorMessages[0] : undefined;
};
