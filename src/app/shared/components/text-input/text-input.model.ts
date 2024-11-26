export interface TextInputConfig {
  variant?: VariantType;
  prefix?: AffixConfig;
  suffix?: AffixConfig;
}

export type VariantType = 'input' | 'textarea';

export type AffixType = 'icon' | 'text' | 'clickable-icon';

export interface AffixConfig {
  value: string;
  affixType?: AffixType;
  onClick?: () => void;
  ariaLabel: string;
}
