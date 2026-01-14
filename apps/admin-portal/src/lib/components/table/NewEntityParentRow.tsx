/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode } from "react";

import { OverridableTableRowProps } from "@/lib/components/table/TableRow";
import { ExpandButton } from "@/lib/components/table/cell/ExpandButtonCell";
import { EntityWrapper } from "@/lib/hooks/useEntities";

export function NewEntityParentRow<TData extends EntityWrapper>(
  props: Pick<OverridableTableRowProps<TData>, "row">,
): ReactNode {
  return <ExpandButton {...props} />;
}
