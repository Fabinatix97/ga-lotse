/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

interface ReadingReceiptProps {
  isReadReceiptEnabled: boolean;
  isRead?: boolean;
}

export function ReadingReceipt({
  isReadReceiptEnabled,
  isRead,
}: Readonly<ReadingReceiptProps>) {
  if (!isReadReceiptEnabled) {
    return (
      <DoneIcon
        color="neutral"
        sx={{ color: "danger.outlinedDisabledColor" }}
      />
    );
  }
  if (isRead) {
    return <DoneAllIcon color="primary" />;
  }
  return <DoneIcon color="primary" />;
}
