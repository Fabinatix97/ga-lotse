/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function ExecutionLayout({
  children,
}: Readonly<RequiresChildren>) {
  return <MainContentLayout fullViewportHeight>{children}</MainContentLayout>;
}
