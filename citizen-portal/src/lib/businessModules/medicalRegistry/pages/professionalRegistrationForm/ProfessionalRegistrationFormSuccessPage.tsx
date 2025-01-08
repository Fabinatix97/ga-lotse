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
        onClick={() => props.setShowSuccessPage(false)}
        sx={{ marginTop: 2 }}
      >
        {t("successPage.createNewEntry")}
      </Button>
    </>
  );
}
