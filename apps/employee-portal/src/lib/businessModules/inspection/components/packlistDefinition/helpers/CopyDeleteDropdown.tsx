/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentCopy, DeleteOutlined } from "@mui/icons-material";

import { ActionsMenu } from "@eshg/lib-employee-portal";

export function CopyDeleteDropdown({
  onDelete,
  onCopy,
}: Readonly<{
  onDelete: () => void;
  onCopy: () => void;
}>) {
  return (
    <ActionsMenu
      actionItems={[
        {
          label: "Duplizieren",
          onClick: onCopy,
          startDecorator: <ContentCopy />,
        },
        {
          label: "Löschen",
          onClick: onDelete,
          color: "danger",
          startDecorator: <DeleteOutlined />,
        },
      ]}
    />
  );
}
