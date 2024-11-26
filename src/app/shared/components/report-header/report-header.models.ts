import { DateTime } from 'luxon';

export interface ReportHeaderInfo {
  reportDate: DateTime;
  generatedDate: DateTime;
  lastModifiedDate: DateTime;
  isEmailSent: boolean;
}

export interface BreadcrumbConfig {
  translationKey: string;
  onClick?: () => void;
}
