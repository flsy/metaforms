import { FormData, InList, MaxLength, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, Mustnotcontain, NotPattern, Optional, Pattern, Required, Validation, Value } from './interfaces';

const isString = (value: Value): value is string => typeof value === 'string';

const isEmpty = (value: Value, rule: Required): Optional<string> => {
  const failingRule = rule.rules.find(() => {
    return value === null || value === undefined || value === '';
  });

  return failingRule && failingRule.message;
};

const getErrorIfDoesNotMatchRegEx = (value: Value, rule: Pattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    const messages = rule.rules.filter(pattern => value.match(pattern.value) === null);

    return messages.length > 0 ? messages[0].message : undefined;
  }
  return undefined;
};

const getErrorIfMatchesRegEx = (value: Value, rule: NotPattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    const errors = rule.rules.filter(pattern => value.match(pattern.value) !== null);

    return errors.length > 0 ? errors[0].message : undefined;
  }
  return undefined;
};

const isNotEqualToExpectedValue = (value: Value, rule: MustBeEqual): Optional<string> => {
  const failingRule = rule.rules.find(r => value !== r.value);
  return failingRule && failingRule.message;
};

const isInList = (value: Value, rule: InList): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    return r.value.indexOf(value) === -1;
  });
  return failingRule && failingRule.message;
};

const isGreaterThanMaxLength = (value: Value, rule: MaxLength): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    if (isString(value)) {
      return value.length > r.value;
    }
    return false;
  });

  return failingRule && failingRule.message;
};

const isLessThanMinLength = (value: Value, rule: MinLength): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    if (isString(value)) {
      return value.length < r.value;
    }
    return false;
  });

  return failingRule && failingRule.message;
};

const mustMatch = (value: Value, rule: MustMatch, formData: FormData): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    return formData[r.value] && formData[r.value] !== value;
  });
  return failingRule && failingRule.message;
};

const mustNotContain = (value: Value, rule: Mustnotcontain, formData: FormData): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    const data = formData[r.value];
    if (data && isString(data) && isString(value)) {
      return value.toLowerCase().includes(data.toLowerCase());
    }
  });
  return failingRule && failingRule.message;
};

const equalIgnoreCase = (a?: string, b?: string) => a && b && a.toLowerCase() === b.toLowerCase();

const mustMatchCaseInsensitive = (value: Value, rule: MustMatchCaseInsensitive, formData: FormData): Optional<string> => {
  const failingRule = rule.rules.find(r => {
    if (isString(value)) {
      return !equalIgnoreCase(formData[r.value] as string, value);
    }
    return false;
  });

  return failingRule && failingRule.message;
};

interface IField {
  value?: Value;
  validation?: Validation[];
}

export const validateField = (formData: FormData, field: IField): Optional<string> => {
  const errorMessages = (field.validation || [])
    .map(rule => {
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
    .filter(error => error && error !== null);

  return errorMessages.length > 0 ? errorMessages[0] : undefined;
};
