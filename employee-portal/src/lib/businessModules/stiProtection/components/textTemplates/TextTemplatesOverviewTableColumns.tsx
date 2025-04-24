/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { ApiTextTemplate } from "@eshg/sti-protection-api";
import { Delete, Edit } from "@mui/icons-material";
import { createColumnHelper } from "@tanstack/react-table";

import { TextTemplateContextLabels } from "./constants";

interface RowActions {
  onEdit: (t: ApiTextTemplate) => void;
  onDelete: (t: ApiTextTemplate) => void;
}
export function textTemplateColumns({ onEdit, onDelete }: RowActions) {
  const columnHelper = createColumnHelper<ApiTextTemplate>();
  return [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("context", {
      header: "Kontext",
      sortingFn: (a, b) =>
        TextTemplateContextLabels[a.original.context].localeCompare(
          TextTemplateContextLabels[b.original.context],
        ),
      cell: (props) => TextTemplateContextLabels[props.getValue()],
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("content", {
      header: "Inhalt",
      cell: (props) => props.getValue(),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "navigationControl",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Bearbeiten",
              startDecorator: <Edit />,
              onClick: () => onEdit(props.row.original),
            },
            {
              label: "Löschen",
              startDecorator: <Delete />,
              onClick: () => onDelete(props.row.original),
              color: "danger",
            },
          ]}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
