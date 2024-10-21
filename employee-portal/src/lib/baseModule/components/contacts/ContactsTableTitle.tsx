/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MergeIcon from "@mui/icons-material/SchemaOutlined";
import { Button } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import { RowSelectionTableToolbar } from "@/lib/shared/components/table/RowSelectionTableToolbar";
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
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        onClick={() => props.onMerge(rowIds)}
        startDecorator={<MergeIcon />}
        disabled={rowIds.length !== 2}
      >
        Kontakte Zusammenführen
      </Button>
    </RowSelectionTableToolbar>
  );
}
