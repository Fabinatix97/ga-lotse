/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Icon from "@mui/icons-material/WarningAmberOutlined";

export function LowCountWarning({ visible }: { visible: boolean }) {
  return (
    <Icon
      aria-hidden={!visible}
      titleAccess="Niedriger Bestand"
      aria-label="Niedriger Bestand"
      color="danger"
      sx={{
        userSelect: "all",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
