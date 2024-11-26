export type SortDirection = 'ascending' | 'descending' | '';

export interface SortResult {
  columnId: string;
  direction: SortDirection;
}

export const nextSortDirection: Record<SortDirection, SortDirection> = {
  '': 'ascending',
  'ascending': 'descending',
  'descending': '',
};

export const directionToMatSymbol: Record<SortDirection, string> = {
  '': '',
  'ascending': 'arrow_upward',
  'descending': 'arrow_downward',
};

export const directionToAriaSortDirection: Record<SortDirection, string> = {
  '': 'none',
  'ascending': 'ascending',
  'descending': 'descending',
};
