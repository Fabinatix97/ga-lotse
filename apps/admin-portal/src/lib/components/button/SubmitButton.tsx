/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, ButtonProps } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

interface SubmitButtonProps extends Omit<ButtonProps, "type" | "loading"> {
  submitting: boolean;
}

export function SubmitButton(props: Readonly<SubmitButtonProps>) {
  const { submitting, disabled, ...buttonProps } = props;
  const { t } = useTranslation();
  return (
    <Button
      {...buttonProps}
      type="submit"
      loadingPosition="start"
      loading={submitting}
      disabled={submitting || disabled}
      aria-label={t("submit")}
    />
  );
}
