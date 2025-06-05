/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";

const taskOverdueLabel = "Die Frist der Aufgabe ist abgelaufen";

export function OverdueTaskIcon() {
  return (
    <WarningAmberOutlined
      color="danger"
      aria-label={taskOverdueLabel}
      titleAccess={taskOverdueLabel}
    />
  );
}
