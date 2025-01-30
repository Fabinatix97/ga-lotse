/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import { FieldSetControl } from "@/lib/shared/components/formFields/FieldSetControl";
import {
  RadioButtonsField,
  RadioButtonsFieldProps,
} from "@/lib/shared/components/formFields/RadioButtonsField";

export interface YesOrNoWithFollowUpProps
  extends PropsWithChildren<
    Omit<RadioButtonsFieldProps, "options" | "label" | "additionalField">
  > {
  sx?: SxProps;
  label: string;
  positiveLabel?: string;
  negativeLabel?: string;
  followUpOnNo?: boolean;
  inlineFollowUp?: boolean;
  optionsOrientation?: "vertical" | "horizontal";
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
  ...radioProps
}: YesOrNoWithFollowUpProps) {
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta(radioProps.name);
  const followUpOn = followUpOnNo ? "no" : "yes";
  const options = [
    { label: positiveLabel ?? "Ja", value: "yes" },
    { label: negativeLabel ?? "Nein", value: "no" },
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
      aria-label={radioProps.label}
    >
      <RadioButtonsField
        resettable
        options={options}
        orientation={optionsOrientation}
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
  if (b == null || b == "") {
    return;
  }
  return b === "yes";
}

export function mapBoolToYesOrNo(
  b: boolean | null | undefined,
): YesOrNoFieldData {
  if (b == null) {
    return null;
  }
  return b ? "yes" : "no";
}
