/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentCopy, DeleteOutlined } from "@mui/icons-material";

import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

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
