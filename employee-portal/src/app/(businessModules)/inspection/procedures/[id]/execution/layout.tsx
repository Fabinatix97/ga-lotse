/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

export default function ExecutionLayout({
  children,
}: Readonly<RequiresChildren>) {
  return <MainContentLayout fullViewportHeight>{children}</MainContentLayout>;
}
