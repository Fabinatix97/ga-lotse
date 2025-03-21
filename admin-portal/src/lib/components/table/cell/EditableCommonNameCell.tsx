/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { StringCell } from "@/lib/components/table/cell/StringCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";

export function EditableCommonNameCell(
  props: CellContext<Actor, string>,
): ReactNode {
  if (!!props.row.original.certificate) {
    return props.getValue();
  }

  return <StringCell {...props} />;
}
