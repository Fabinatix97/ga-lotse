/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

import { AccessCheck } from "@/helpers/accessControl";

export interface SideNavigationLinkItem {
  type: "SideNavigationLinkItem";
  name: string;
  href: string;
  decorator: ReactNode;
  accessCheck: AccessCheck;
  chip?: ReactNode;
}

export interface SideNavigationParentItem {
  type: "SideNavigationParentItem";
  name: string;
  decorator: ReactNode;
  subItems: SideNavigationSubItem[];
}

export interface SideNavigationSuspenseItem {
  type: "SideNavigationSuspenseItem";
  name: string;
  decorator: ReactNode;
  accessCheck: AccessCheck;
  component: (props: SideNavigationItemsProps) => ReactNode;
}

export interface SideNavigationSubItem {
  name: string;
  href: string;
  accessCheck: AccessCheck;
}

export type SideNavigationItem =
  | SideNavigationLinkItem
  | SideNavigationParentItem
  | SideNavigationSuspenseItem;

export interface SideNavigationItemsProps {
  isInboxEnabled: boolean;
}
