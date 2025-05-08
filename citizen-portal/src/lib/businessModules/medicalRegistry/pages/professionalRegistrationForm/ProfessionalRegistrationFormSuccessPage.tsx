/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Typography } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface ProfessionalRegistrationFormProps {
  setShowSuccessPage: (showSuccessPage: boolean) => void;
}

export function ProfessionalRegistrationFormSuccessPage(
  props: ProfessionalRegistrationFormProps,
) {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <>
      <PageTitle>{t("navigation.pageTitle")}</PageTitle>
      <Typography level="h4" alignSelf="center">
        {t("successPage.content")}
      </Typography>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => props.setShowSuccessPage(false)}
      >
        {t("successPage.createNewEntry")}
      </Button>
    </>
  );
}
