/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RowSelectionState } from "@tanstack/react-table";

import {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
  mapRowSelectionToRowIds,
} from "@eshg/lib-employee-portal";

import { Child } from "../../api/models/Child";

import { useUpdateFluoridationConsentBulkSidebar } from "./UpdateFluoridationConsentInBulkSidebar";

interface ChildrenTableTitleProps {
  rowSelection: RowSelectionState;
  childrenData: Child[];
}

export function ChildrenTableTitle(props: ChildrenTableTitleProps) {
  const selectedChildIds = mapRowSelectionToRowIds(props.rowSelection);
  const updateFluoridationConsentBulk =
    useUpdateFluoridationConsentBulkSidebar();

  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{
        singular: "Kind ausgewählt",
        plural: "Kinder ausgewählt",
      }}
    >
      {selectedChildIds.length > 0 && (
        <RowSelectionTableToolbarButton
          onClick={() =>
            updateFluoridationConsentBulk.open({ childIds: selectedChildIds })
          }
        >
          Fluoridierungseinverständnis
        </RowSelectionTableToolbarButton>
      )}
    </RowSelectionTableToolbar>
  );
}
