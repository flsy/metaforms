class Builder {
  fields: { [key:string]: any } = {};

  addField = (name: string, type: string, props: { [key: string]: any}) => {
    this.fields[name] = { type, ...props };
    return this;
  }

  build = () => this.fields;
}

type InputProps = { label: string, placeholder: string };
type SubmitProps = { label: string };

export class AntBuilder extends Builder {
  addInput = (name: string, p?: InputProps) => {
    this.addField(name, 'input', p);
    return this;
  }
  addSubmit = (name, p?: SubmitProps) => {
    this.addField(name, 'submit', p);
    return this;
  }
}
