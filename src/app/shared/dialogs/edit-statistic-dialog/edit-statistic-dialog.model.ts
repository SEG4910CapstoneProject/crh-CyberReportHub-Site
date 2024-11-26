import { JsonStatsResponse } from '../../sdk/rest-api/model/jsonStatsResponse';

export interface EditStatDialogData {
  stat: JsonStatsResponse;
}

export type EditStatDialogResult = undefined | EditStatDialogResultObject;

export interface EditStatDialogResultObject {
  title: string;
  subtitle: string | undefined;
  value: number;
}
