/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

export default function ProcedureTemplate(props: Readonly<RequiresChildren>) {
  return (
    <QueryBoundary>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </QueryBoundary>
  );
}
