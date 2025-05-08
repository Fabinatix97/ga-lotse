/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MergeIcon from "@mui/icons-material/SchemaOutlined";
import { RowSelectionState } from "@tanstack/react-table";

import {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
  mapRowSelectionToRowIds,
} from "@eshg/lib-employee-portal";

interface ContactsTableTitleProps {
  rowSelection: RowSelectionState;
  onMerge: (contactIds: string[]) => void;
}

export function ContactsTableTitle(props: ContactsTableTitleProps) {
  const rowIds = mapRowSelectionToRowIds(props.rowSelection);
  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{ singular: "Kontakt", plural: "Kontakte" }}
    >
      <RowSelectionTableToolbarButton
        decorator={<MergeIcon />}
        disabled={rowIds.length !== 2}
        onClick={() => props.onMerge(rowIds)}
      >
        Kontakte Zusammenführen
      </RowSelectionTableToolbarButton>
    </RowSelectionTableToolbar>
  );
}
