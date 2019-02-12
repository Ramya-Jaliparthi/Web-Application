export type SecurityQuestion = {
  text: string;
  id: string;
  options: Option[];
}

export type Option = {
  label: string;
  value: string;
}
