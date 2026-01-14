/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ButtonProps } from "@mui/joy";

interface SubmitButtonProps extends Omit<ButtonProps, "type" | "loading"> {
  submitting: boolean;
}

export function SubmitButton(props: SubmitButtonProps) {
  const { submitting, disabled, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      type="submit"
      loadingPosition="start"
      loading={submitting}
      disabled={submitting || disabled}
    />
  );
}
