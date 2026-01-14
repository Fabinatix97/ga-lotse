/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box } from "@mui/joy";

interface ReadingReceiptProps {
  isReadReceiptEnabled: boolean;
  isRead?: boolean;
  isSent: boolean;
}

export function ReadingReceipt({
  isReadReceiptEnabled,
  isRead,
  isSent,
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
  if (isSent) {
    return <DoneIcon color="primary" />;
  }
  return <Box sx={{ width: 20, height: 20 }} />;
}
