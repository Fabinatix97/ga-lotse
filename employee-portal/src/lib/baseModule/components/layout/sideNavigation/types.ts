/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

import { AccessCheck } from "@/lib/shared/helpers/accessControl";

export interface SideNavigationItemWithoutSubItems {
  name: string;
  href: string;
  decorator: ReactNode;
  accessCheck: AccessCheck;
  chip?: ReactNode;
}

export interface SideNavigationItemWithSubItems {
  name: string;
  decorator: ReactNode;
  subItems: SideNavigationSubItem[];
  /**
   * Errors can occur when resolving the navigation items.
   * This can happen, for example, when querying feature toggles of a module that's currently not available.
   * In this case, the main navigation item is deactivated and an error icon with tooltip is displayed.
   */
  error?: string;
}

export interface SideNavigationSubItem {
  name: string;
  href: string;
  accessCheck: AccessCheck;
}

export type SideNavigationItem =
  | SideNavigationItemWithoutSubItems
  | SideNavigationItemWithSubItems;
