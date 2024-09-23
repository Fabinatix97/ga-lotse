/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode } from "react";

export interface SpecificNotificationProps {
  title: string;
  content: ReactNode;
  severity: "info" | "warning";
}
