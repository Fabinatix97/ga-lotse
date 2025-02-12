/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { Tooth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

export function ToothNumber(props: { tooth: Tooth }) {
  return (
    <Typography
      sx={{
        fontSize: theme.fontSize.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.palette.background.level3,
        fontWeight: theme.fontWeight.lg,
        width: 36,
        height: 24,
        textAlign: "center",
      }}
    >
      {getToothNumber(props.tooth)}
    </Typography>
  );
}

export function getToothNumber(tooth: Tooth): number {
  return Number.parseInt(tooth.toothNumber.substring(1));
}
