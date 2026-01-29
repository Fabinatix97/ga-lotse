/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/prostituteProtection/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

export function ButtonBar({ onResetClick }: { onResetClick: () => void }) {
  const { t } = useTranslation("prostituteProtection/forms");
  const prostituteProtectionRoutes = useCitizenRoutes();

  return (
    <ContentSheet>
      <Stack gap={2}>
        <Button onClick={onResetClick}>{t("common.create_appointment")}</Button>
        <ScopedInternalLinkButton
          color="neutral"
          variant="soft"
          href={prostituteProtectionRoutes.overview}
        >
          {t("common.back")}
        </ScopedInternalLinkButton>
      </Stack>
    </ContentSheet>
  );
}
