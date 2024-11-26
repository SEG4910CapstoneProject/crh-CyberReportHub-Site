export interface SelectConfig {
  options: SelectOption[];
  multiple?: boolean;
}

export interface SelectOption {
  id: string;
  label: string;
}
