/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MergeIcon from "@mui/icons-material/SchemaOutlined";
import { RowSelectionState } from "@tanstack/react-table";

import { RowSelectionTableToolbar } from "@/lib/shared/components/table/RowSelectionTableToolbar";
import { RowSelectionTableToolbarButton } from "@/lib/shared/components/table/RowSelectionTableToolbarButton";
import { mapToRowIds } from "@/lib/shared/hooks/table/useRowSelection";

interface ContactsTableTitleProps {
  rowSelection: RowSelectionState;
  onMerge: (contactIds: string[]) => void;
}

export function ContactsTableTitle(props: ContactsTableTitleProps) {
  const rowIds = mapToRowIds(props.rowSelection);
  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{ singular: "Kontakt", plural: "Kontakte" }}
    >
      <RowSelectionTableToolbarButton
        onClick={() => props.onMerge(rowIds)}
        decorator={<MergeIcon />}
        disabled={rowIds.length !== 2}
      >
        Kontakte Zusammenführen
      </RowSelectionTableToolbarButton>
    </RowSelectionTableToolbar>
  );
}
