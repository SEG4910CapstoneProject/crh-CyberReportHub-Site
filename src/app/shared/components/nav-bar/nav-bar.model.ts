export interface NavBarLink {
  id: NavBarSelectedLinkOptions;
  label: string | undefined;
  path: string;
}

export type LoginButtonAction = () => void;
export type LogoAction = () => void;

export type NavBarSelectedLinkOptions =
  | 'home'
  | 'reportSearch'
  | 'reportStats'
  | 'none';
