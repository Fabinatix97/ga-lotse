/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DoneOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/joy";

import { useCitizenRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

interface ProfessionalRegistrationFormProps {
  setShowSuccessPage: (showSuccessPage: boolean) => void;
}

export function ProfessionalRegistrationFormSuccessPage(
  props: ProfessionalRegistrationFormProps,
) {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);
  const citizenRoutes = useCitizenRoutes();

  return (
    <>
      <PageTitle>{t("navigation.pageTitle")}</PageTitle>
      <TwoColumnGrid
        content={
          <ContentSheet>
            <Typography level="h2">{t("successPage.content")}</Typography>
            <DoneOutlined
              sx={{ height: 80, width: 80, alignSelf: "center" }}
              color="success"
            />
          </ContentSheet>
        }
        sidePanel={
          <ContentSheet>
            <Button onClick={() => props.setShowSuccessPage(false)}>
              {t("successPage.registrationForm")}
            </Button>

            <ScopedInternalLinkButton
              variant="soft"
              color="neutral"
              href={citizenRoutes.home}
            >
              {t("navigation.abort")}
            </ScopedInternalLinkButton>
          </ContentSheet>
        }
      />
    </>
  );
}
