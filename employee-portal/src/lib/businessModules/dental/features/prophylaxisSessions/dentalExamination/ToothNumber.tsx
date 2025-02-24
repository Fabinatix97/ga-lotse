/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { theme } from "@/lib/baseModule/theme/theme";
import { Tooth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface ToothNumberProps {
  tooth: Tooth;
  sx?: SxProps;
}

export function ToothNumber(props: ToothNumberProps) {
  return (
    <Typography
      component="legend"
      sx={{
        fontSize: theme.fontSize.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.palette.background.level3,
        fontWeight: theme.fontWeight.lg,
        width: 36,
        height: 24,
        textAlign: "center",
        //marginLeft and -Right needs to be set for firefox
        marginRight: "auto",
        marginLeft: "auto",
        ...props.sx,
      }}
    >
      {getToothNumber(props.tooth)}
    </Typography>
  );
}

export function getToothNumber(tooth: Tooth): number {
  return Number.parseInt(tooth.toothNumber.substring(1));
}
