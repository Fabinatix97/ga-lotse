/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";

import { useStepContext } from "@/lib/businessModules/stiProtection/components/shared/StepContext";
import { useTranslation } from "@/lib/i18n/client";

export function StepButtons() {
  const { t } = useTranslation();
  const { goBack, isLastStep } = useStepContext();
  return (
    <Stack gap={2}>
      <Button type="submit">{t("common.continue")}</Button>
      {isLastStep ? (
        <Button variant="outlined" onClick={() => goBack()}>
          {t("common.back")}
        </Button>
      ) : undefined}
      <Button variant="soft">{t("common.cancel")}</Button>
    </Stack>
  );
}
