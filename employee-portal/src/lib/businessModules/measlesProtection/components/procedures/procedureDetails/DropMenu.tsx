/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { useCallback } from "react";

import { ActionsItem, ActionsMenu } from "@eshg/lib-employee-portal";

export interface DropMenuEvents<T> {
  onDelete?: (cust: T) => void;
  onEdit?: (cust: T) => void;
}

export function DropMenu<T>({
  onDelete,
  onEdit,
  data,
}: DropMenuEvents<T> & { data: T }) {
  const handleDelete = useCallback(() => {
    if (!onDelete) {
      return;
    }
    onDelete(data);
  }, [onDelete, data]);

  const handleEdit = useCallback(() => {
    if (!onEdit) {
      return;
    }
    onEdit(data);
  }, [onEdit, data]);

  return (
    <ActionsMenu
      disabled={onDelete == null && onEdit == null}
      actionItems={[
        ...(onEdit != null
          ? [
              {
                label: "Bearbeiten",
                onClick: handleEdit,
                startDecorator: <Edit />,
              },
            ]
          : []),
        ...(onDelete != null
          ? [
              {
                label: "Löschen",
                onClick: handleDelete,
                startDecorator: <Delete color="danger" />,
                color: "danger",
              } satisfies ActionsItem,
            ]
          : []),
      ]}
    />
  );
}
