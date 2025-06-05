/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIconComponent } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";

export type NavigationState =
  | { type: "closed" }
  | { type: "main-menu" }
  | { type: "sub-menu"; selectedMainItem: NavigationItem }
  | { type: "language" };

export interface NavigationItem {
  name: string;
  subItems: SubNavigationItem[];
}

export interface SubNavigationItem {
  name: string;
  description?: string;
  href: string;
  icon: SvgIconComponent;
}

export type UserType = "person" | "organization";

export interface NavigationProps {
  navigationState: NavigationState;
  setNavigationState: Dispatch<SetStateAction<NavigationState>>;
  navigationItems: NavigationItem[];
  userType: UserType;
}
