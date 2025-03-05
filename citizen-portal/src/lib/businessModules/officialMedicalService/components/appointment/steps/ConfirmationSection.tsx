/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

import { PrivacyPolicyConfirmationSection } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/PrivacyPolicyConfirmationSection";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheetTitle } from "@/lib/shared/components/layout/contentSheet";

interface ConfirmationSectionProps {
  buttonBar: ReactNode;
}
export function ConfirmationSection({
  buttonBar,
}: Readonly<ConfirmationSectionProps>) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return (
    <>
      <ContentSheetTitle>{t("confirmation.title")}</ContentSheetTitle>
      <Stack gap={2}>
        <PrivacyPolicyConfirmationSection />
        {buttonBar}
      </Stack>
    </>
  );
}
