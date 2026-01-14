/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

export function ResetButton(props: Readonly<{ onReset: () => void }>) {
  const { t } = useTranslation();
  return (
    <IconButton
      variant="plain"
      color="neutral"
      aria-label={t("reset")}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={props.onReset}
    >
      <CloseRoundedIcon />
    </IconButton>
  );
}
