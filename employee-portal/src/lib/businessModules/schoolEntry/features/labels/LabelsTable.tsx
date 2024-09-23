/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Button } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { CreateLabelSidebar } from "@/lib/businessModules/schoolEntry/features/labels/CreateLabelSidebar";
import { LabelChip } from "@/lib/businessModules/schoolEntry/features/labels/LabelChip";
import { UpdateLabelSidebar } from "@/lib/businessModules/schoolEntry/features/labels/UpdateLabelSidebar";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

const columnHelper = createColumnHelper<Label>();

type SidebarState =
  | {
      type: "create";
    }
  | {
      type: "edit";
      item: Label;
    };

interface LabelColumnsProps {
  onEdit: (item: Label) => void;
}

export function labelColumns({ onEdit }: LabelColumnsProps) {
  return [
    columnHelper.accessor("name", {
      header: "Kennung",
      cell: (props) => <LabelChip label={props.row.original} />,
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
    columnHelper.accessor("readonly", {
      header: "Erstellt von",
      cell: (props) => (props.getValue() ? "System" : "Benutzer"),
      meta: {
        width: 160,
      },
      enableSorting: false,
    }),
    columnHelper.accessor("readonly", {
      header: "Aktionen",
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
            <EditIcon />
          </Button>
        ),
      enableSorting: false,
      meta: {
        width: 80,
      },
    }),
  ];
}

interface LabelsTableProps {
  labels: Label[];
  loading: boolean;
}

export function LabelsTable(props: LabelsTableProps) {
  const [action, setAction] = useState<SidebarState>();

  return (
    <>
      <TablePage
        controls={
          <ButtonBar
            right={
              <Button
                startDecorator={<Add />}
                onClick={() => setAction({ type: "create" })}
                size="sm"
              >
                Kennung hinzufügen
              </Button>
            }
          />
        }
      >
        <TableSheet loading={props.loading}>
          <DataTable
            data={props.labels}
            columns={labelColumns({
              onEdit: (item) => {
                setAction({ type: "edit", item });
              },
            })}
            minWidth={750}
          />
        </TableSheet>
      </TablePage>

      {action?.type === "create" && (
        <OverlayBoundary>
          <CreateLabelSidebar onClose={() => setAction(undefined)} />
        </OverlayBoundary>
      )}

      {action?.type === "edit" && (
        <OverlayBoundary>
          <UpdateLabelSidebar
            onClose={() => setAction(undefined)}
            label={action.item}
          />
        </OverlayBoundary>
      )}
    </>
  );
}
