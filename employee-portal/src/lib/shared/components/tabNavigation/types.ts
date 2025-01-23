/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessCheck } from "@eshg/lib-employee-portal/helpers/accessControl";
import { ColorPaletteProp } from "@mui/joy";
import { ReactNode } from "react";

export interface TabNavigationItem {
  tabButtonName: string;
  href: string;
  decorator: ReactNode;
  disabled?: boolean;
  color?: ColorPaletteProp;
  accessCheck?: AccessCheck;
  exactMatch?: boolean;
}
