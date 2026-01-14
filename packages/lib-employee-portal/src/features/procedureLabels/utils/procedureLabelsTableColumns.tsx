/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { ProcedureLabel } from "../api/models/ProcedureLabel";
import { ProcedureLabelChip } from "../components/ProcedureLabelChip";

const columnHelper = createColumnHelper<ProcedureLabel>();

interface ProcedureLabelColumnsProps {
  onEdit: (item: ProcedureLabel) => void;
  hasReadOnlyProcedureLabels: boolean;
  canUserWrite: boolean;
}

export function procedureLabelColumns({
  onEdit,
  hasReadOnlyProcedureLabels,
  canUserWrite,
}: ProcedureLabelColumnsProps) {
  const defaultColumns = [
    columnHelper.accessor("name", {
      header: "Kennung",
      cell: (props) => <ProcedureLabelChip value={props.row.original} />,
      enableSorting: false,
      meta: {
        width: 240,
      },
    }),
    columnHelper.accessor("description", {
      header: "Beschreibung",
      cell: (props) => props.getValue(),
      enableSorting: false,
    }),
  ];

  const readonlyColumns = hasReadOnlyProcedureLabels
    ? [
        columnHelper.accessor("readonly", {
          header: "Erstellt von",
          id: "createdBy",
          cell: (props) => (props.getValue() ? "System" : "Benutzer"),
          meta: {
            width: 160,
          },
          enableSorting: false,
        }),
      ]
    : [];

  const actionColumns = canUserWrite
    ? [
        columnHelper.accessor("readonly", {
          header: "Aktionen",
          id: "actions",
          cell: (props) =>
            props.getValue() ? (
              ""
            ) : (
              <Button
                variant="plain"
                color="neutral"
                aria-label="Bearbeiten"
                title="Bearbeiten"
                onClick={() => onEdit(props.cell.row.original)}
              >
                <EditOutlined />
              </Button>
            ),
          enableSorting: false,
          meta: {
            width: 80,
          },
        }),
      ]
    : [];

  return [...defaultColumns, ...readonlyColumns, ...actionColumns];
}
