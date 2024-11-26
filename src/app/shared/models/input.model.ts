export interface ErrorHintConfig {
  hint: string;
  hasError?: (value: string | undefined) => boolean;
}
