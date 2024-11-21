/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function ProcedureTemplate(props: Readonly<RequiresChildren>) {
  return (
    <QueryBoundary>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </QueryBoundary>
  );
}
