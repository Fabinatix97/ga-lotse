/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { QueryBoundary, RequiresChildren } from "@eshg/lib-portal";

export default function ProcedureTemplate(props: Readonly<RequiresChildren>) {
  return (
    <QueryBoundary>
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </QueryBoundary>
  );
}
