type OmitType<T extends { type: string }> = Omit<T, 'type'>;

type InputProps = { type: 'input', label: string, placeholder?: string };
type SubmitProps = { type: 'submit', label: string };

type Fields = { [key: string]: SubmitProps | InputProps }
type Field<T> = { [key: string]: T }

export const input = <T>(name: string, props?: OmitType<InputProps>) => (fields: T): T & Field<InputProps> => {
  return {...fields, [name]: { type: 'input', ...props }}
}

export const submit = <T>(name: string, props?: OmitType<SubmitProps>) => (fields: T): T & Field<SubmitProps> => {
  return {...fields, [name]: { type: 'submit', ...props }}
}

export const build = <T>(...fc: Array<(fields: Fields) => Fields>) => fc.reduce((acc, f) => f(acc), {} as Fields);
