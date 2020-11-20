class Builder {
  fields: { [key:string]: any } = {};

  addField = ({ name, ...props }: { name: string, [key: string]: any}) => {
    this.fields[name] = props;
    return this;
  }

  build = () => this.fields;
}

type InputProps = { name: string, label: string, placeholder: string };
type SubmitProps = { name: string, label: string };

export class AntBuilder extends Builder {
  addInput = (p: InputProps) => {
    this.addField({ type: 'input', ...p });
    return this;
  }
  addSubmit = (p: SubmitProps) => {
    this.addField(({ type: 'submit', ...p }));
    return this;
  }
}
