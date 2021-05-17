import { Icon } from '@visurel/iconify-angular';
import {AuthName} from 'src/app/service/auth.service';

export type NavigationItem = NavigationLink | NavigationDropdown | NavigationSubheading;

export interface NavigationLink {
  type: 'link';
  route: string | any;
  fragment?: string;
  label: string;
  icon?: Icon;
  auth?: AuthName[] | AuthName;
  routerLinkActiveOptions?: { exact: boolean };
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
}

export interface NavigationDropdown {
  type: 'dropdown';
  label: string;
  icon?: Icon;
  auth?: AuthName[] | AuthName;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
}

export interface NavigationSubheading {
  type: 'subheading';
  label: string;
  auth?: AuthName[] | AuthName;
  children: Array<NavigationLink | NavigationDropdown>;
}
