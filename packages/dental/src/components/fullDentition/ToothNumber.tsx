/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, styled } from "@mui/joy";

import { Tooth, isAddableTooth } from "../../stores/examination/types";
import { formatToothNumber } from "../../utils/formatters";

import { SR_ONLY_STYLES } from "./styles";

const ToothNumberTypography = styled(Typography)(({ theme }) => ({
  display: "inline-block",
  fontSize: theme.fontSize.md,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.palette.neutral[400],
  fontWeight: theme.fontWeight.lg,
  width: 36,
  height: 24,
  textAlign: "center",
})) as typeof Typography;

interface ToothNumberProps {
  id: string;
  tooth: Tooth;
}

export function ToothNumber(props: ToothNumberProps) {
  const { id, tooth } = props;

  return (
    <>
      <ToothNumberTypography id={id} component="span">
        {formatToothNumber(tooth.toothNumber)}
      </ToothNumberTypography>
      <SrOnlyText role="status" aria-live="polite">
        {getToothType(tooth)}
      </SrOnlyText>
    </>
  );
}
const SrOnlyText = styled("p")(SR_ONLY_STYLES);

function getToothType(tooth: Tooth): string {
  if (isAddableTooth(tooth)) {
    return "Kein Zahn vorhanden";
  }

  return tooth.toothType === "PRIMARY_TOOTH" ? "Milchzahn" : "bleibender Zahn";
}
