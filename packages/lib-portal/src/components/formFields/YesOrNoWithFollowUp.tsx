/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";
import { isNullish } from "remeda";

import { useTranslation } from "../../i18n/useTranslation";

import { FieldSetControl } from "./FieldSetControl";
import { RadioButtonsField, RadioButtonsFieldProps } from "./RadioButtonsField";

interface YesOrNoWithFollowUpProps
  extends PropsWithChildren<
    Omit<RadioButtonsFieldProps, "options" | "additionalField">
  > {
  sx?: SxProps;
  ariaLabel?: string;
  positiveLabel?: string;
  negativeLabel?: string;
  followUpOnNo?: boolean;
  inlineFollowUp?: boolean;
  optionsOrientation?: "vertical" | "horizontal";
  resetLabel?: string;
  onReset?: () => unknown;
}

export function YesOrNoWithFollowUp({
  children,
  sx,
  positiveLabel,
  negativeLabel,
  inlineFollowUp,
  followUpOnNo,
  orientation,
  optionsOrientation,
  resetLabel,
  onReset,
  ...radioProps
}: YesOrNoWithFollowUpProps) {
  const { t } = useTranslation();
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta(radioProps.name);
  const followUpOn = followUpOnNo ? "no" : "yes";
  const options = [
    { label: positiveLabel ?? t("common.yes"), value: "yes" },
    { label: negativeLabel ?? t("common.no"), value: "no" },
  ];
  const show = value === followUpOn;
  const showBelow = show && !inlineFollowUp;
  const showInline = show && inlineFollowUp;

  const verticalOrientation = orientation === "vertical";
  const orientationStyles = verticalOrientation
    ? {
        display: "flex",
      }
    : {
        display: "grid",
        gridTemplateColumns: inlineFollowUp ? "1fr" : "1fr 1fr",
      };

  return (
    <FieldSetControl
      sx={{
        ...orientationStyles,
        border: "none",
        padding: 0,
        ...sx,
      }}
      aria-label={
        !radioProps.ariaLabel && typeof radioProps.label === "string"
          ? radioProps.label
          : radioProps.ariaLabel
      }
    >
      <RadioButtonsField
        resetLabel={resetLabel}
        resettable
        options={options}
        orientation={optionsOrientation}
        onReset={onReset}
        {...radioProps}
        additionalField={showInline ? children : undefined}
      />
      {showBelow ? children : undefined}
    </FieldSetControl>
  );
}

export type YesOrNoFieldData = "yes" | "no" | null;

export function mapYesOrNoToBool(
  b: YesOrNoFieldData | "",
): boolean | undefined {
  if (b === null || b === "") {
    return;
  }
  return b === "yes";
}

export function mapBoolToYesOrNo(
  b: boolean | null | undefined,
): YesOrNoFieldData {
  if (isNullish(b)) {
    return null;
  }
  return b ? "yes" : "no";
}
