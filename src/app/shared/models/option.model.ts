export class Option {
  value: string;
  label: string;

  static getOption(value: string, label?: string): Option {
    const option = new Option();
    option.label = label ? label : value;
    option.value = value;
    return option;
  }
}
