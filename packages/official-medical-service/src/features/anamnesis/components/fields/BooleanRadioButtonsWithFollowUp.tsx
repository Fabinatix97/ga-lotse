/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { memo } from "react";

import { FieldSetControl, RequiresChildren } from "@eshg/lib-portal";

import { BooleanRadioField, BooleanRadioFieldProps } from "./BooleanRadioField";

interface BooleanRadioButtonsWithFollowUpProps
  extends Omit<BooleanRadioFieldProps, "label" | "children">,
    RequiresChildren {
  label: string;
  sx?: SxProps;
  followUpOn: boolean;
}

export function BooleanRadioButtonsWithFollowUp(
  props: BooleanRadioButtonsWithFollowUpProps,
) {
  const { getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta<boolean>(props.name);

  return <MemoizedBooleanRadioButtonsWithFollowUp value={value} {...props} />;
}

interface InnerBooleanRadioButtonsWithFollowUpProps
  extends BooleanRadioButtonsWithFollowUpProps {
  value: boolean;
}
const MemoizedBooleanRadioButtonsWithFollowUp = memo(
  InnerBooleanRadioButtonsWithFollowUp,
);
function InnerBooleanRadioButtonsWithFollowUp({
  followUpOn,
  value,
  sx,
  children,
  ...radioProps
}: InnerBooleanRadioButtonsWithFollowUpProps) {
  const show = value === followUpOn;

  return (
    <FieldSetControl
      sx={{
        border: "none",
        padding: 0,
        ...sx,
      }}
      aria-label={radioProps.label}
      aria-live="polite"
    >
      <BooleanRadioField {...radioProps} />
      {show ? (
        <Stack direction="column" gap={3}>
          {children}
        </Stack>
      ) : undefined}
    </FieldSetControl>
  );
}
