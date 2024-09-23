/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { ScopedAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { PAGE_ALERT_STYLE } from "@/lib/styles";

export default function RootTemplate(props: RequiresChildren) {
  return (
    <QueryBoundary>
      <ScopedAlert sx={PAGE_ALERT_STYLE} />
      {props.children}
    </QueryBoundary>
  );
}
