/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColorPaletteProp } from "@mui/joy";
import { ReactNode } from "react";

import { AccessCheck } from "@/lib/shared/helpers/accessControl";

export interface TabNavigationItem {
  tabButtonName: string;
  href: string;
  decorator: ReactNode;
  disabled?: boolean;
  color?: ColorPaletteProp;
  accessCheck?: AccessCheck;
  exactMatch?: boolean;
}
