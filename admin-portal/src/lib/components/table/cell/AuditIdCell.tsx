/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ColoredText } from "@/lib/components/table/cell/ColoredText";
import { AuditEntity, RevisionType } from "@/lib/types/audit";

export function AuditIdCell<TData extends AuditEntity>(
  props: CellContext<TData, string>,
): ReactNode {
  switch (props.row.original.revisionType) {
    case RevisionType.ADD:
      return <ColoredText color="success" value={props.getValue()} />;
    case RevisionType.MOD:
      return <ColoredText color="neutral" value={props.getValue()} />;
    case RevisionType.DEL:
      return <ColoredText color="danger" value={props.getValue()} />;
  }
}
