/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { EditableStringCell } from "@/lib/components/table/cell/EditableStringCell";
import { Actor } from "@/lib/components/view/actors/ActorTable";

export function EditableCommonNameCell(
  props: CellContext<Actor, string>,
): ReactNode {
  if (
    !!props.row.original.currentCertificate ||
    props.row.original.previousCertificate
  ) {
    return props.getValue();
  }

  return <EditableStringCell {...props} />;
}
