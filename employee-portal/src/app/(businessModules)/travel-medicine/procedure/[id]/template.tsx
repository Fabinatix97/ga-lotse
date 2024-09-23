/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

export default function ProcedureTemplate(props: Readonly<RequiresChildren>) {
  return <QueryBoundary>{props.children}</QueryBoundary>;
}
