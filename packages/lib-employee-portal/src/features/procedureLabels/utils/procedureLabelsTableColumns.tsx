/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { ChipWithTooltip } from "@/components/chip/ChipWithTooltip";
import { ProcedureLabel } from "@/features/procedureLabels/api/models/ProcedureLabel";

const columnHelper = createColumnHelper<ProcedureLabel>();

interface ProcedureLabelColumnsProps {
  onEdit: (item: ProcedureLabel) => void;
  hasReadOnlyProcedureLabels: boolean;
}

export function procedureLabelColumns({
  onEdit,
  hasReadOnlyProcedureLabels,
}: ProcedureLabelColumnsProps) {
  const defaultColumns = [
    columnHelper.accessor("name", {
      header: "Kennung",
      cell: (props) => (
        <ChipWithTooltip
          name={props.row.original.name}
          hexColor={props.row.original.hexColor}
          modalTitle="Kennung"
        />
      ),
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

  return [
    ...defaultColumns,
    ...readonlyColumns,
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
            onClick={() => onEdit(props.cell.row.original)}
            aria-label="Bearbeiten"
            title="Bearbeiten"
          >
            <EditOutlined />
          </Button>
        ),
      enableSorting: false,
      meta: {
        width: 80,
      },
    }),
  ];
}
