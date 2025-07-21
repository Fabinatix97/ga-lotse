/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIconComponent } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";

export type NavigationState =
  | { type: "closed" }
  | { type: "topic-menu" }
  | { type: "language" };

export const ModuleCategory = {
  ChildAndYouthHealth: "child_and_youth_health",
  InfectiousDiseases: "infectious_diseases",
  MentalHealth: "mental_health",
  Hygiene: "hygiene",
  DentalHealth: "dental_health",
};
export type ModuleCategory =
  (typeof ModuleCategory)[keyof typeof ModuleCategory];

export interface ModuleNavigationItem {
  category?: ModuleCategory;
  navigationItem: NavigationItem;
}

export type NavigationItem = NavigationCategory | NavigationLink;

export type NavigationCategory = NavigationGroup<NavigationItem>;

export interface NavigationGroup<TItem> {
  name: string;
  items: TItem[];
}

export interface NavigationLink {
  name: string;
  href: string;
}

export type NavigationCards = NavigationGroup<NavigationCardItem>;

export interface NavigationCardItem {
  name: string;
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

export function isNavigationLink(item: NavigationItem): item is NavigationLink {
  return "href" in item;
}
