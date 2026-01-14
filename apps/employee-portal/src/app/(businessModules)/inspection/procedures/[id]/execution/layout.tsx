/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

export default function ExecutionLayout({
  children,
}: Readonly<RequiresChildren>) {
  return <MainContentLayout fullViewportHeight>{children}</MainContentLayout>;
}
