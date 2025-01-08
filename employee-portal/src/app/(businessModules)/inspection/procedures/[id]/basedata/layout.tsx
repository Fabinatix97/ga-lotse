/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function BaseDataLayout({
  children,
}: Readonly<RequiresChildren>) {
  return <MainContentLayout>{children}</MainContentLayout>;
}
