/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, Adjust, Remove } from "@mui/icons-material";
import { CellContext } from "@tanstack/react-table";
import { ReactNode } from "react";

import { RevisionType } from "@/lib/types/audit";

export function RevisionTypeCell<TData>(
  props: CellContext<TData, RevisionType>,
): ReactNode {
  switch (props.getValue()) {
    case RevisionType.ADD:
      return <Add color="success" />;
    case RevisionType.MOD:
      return <Adjust />;
    case RevisionType.DEL:
      return <Remove color="danger" />;
  }
}
