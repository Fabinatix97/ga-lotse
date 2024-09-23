/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode } from "react";

import { OverridableTableRowProps } from "@/lib/components/table/TableRow";
import { ExpandButton } from "@/lib/helpers/addFeatureColumns";
import { UniqueEntity } from "@/lib/helpers/entities";

export function NewEntityParentRow<TData extends UniqueEntity>(
  props: OverridableTableRowProps<TData>,
): ReactNode {
  return <ExpandButton {...props} />;
}
