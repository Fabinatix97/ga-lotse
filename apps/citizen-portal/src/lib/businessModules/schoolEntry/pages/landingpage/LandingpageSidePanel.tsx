/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { ButtonLink, FormPlus, useFileDownload } from "@eshg/lib-portal";

import { useSchoolEntryPublicCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const accessCode = useAccessCodeParam();
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();

  function handleConfirm() {
    router.push(citizenRoutes.appointment.index(accessCode));
  }

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("personalArea.title")}</ContentSheetTitle>
      <Typography>{t("personalArea.information")}</Typography>
      <Formik
        initialValues={INITIAL_VALUES}
        component={PrivacyPolicyConfirmationForm}
        onSubmit={handleConfirm}
      />
    </ContentSheet>
  );
}

interface PrivacyPolicyConfirmationFormValues {
  confirmPrivacyPolicy: boolean;
  confirmPrivacyNotice: boolean;
}

const INITIAL_VALUES: PrivacyPolicyConfirmationFormValues = {
  confirmPrivacyPolicy: false,
  confirmPrivacyNotice: false,
};

function PrivacyPolicyConfirmationForm() {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const publicCitizenApi = useSchoolEntryPublicCitizenApi();
  const privacyNoticeFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyNoticeRaw(),
  );
  const privacyPolicyFile = useFileDownload(() =>
    publicCitizenApi.getPrivacyPolicyRaw(),
  );

  return (
    <FormPlus aria-label={t("personalArea.title")} sx={{ display: "contents" }}>
      <Stack gap={1}>
        <ConfirmationCheckboxField
          name="confirmPrivacyNotice"
          label={t("personalArea.confirmPrivacyNotice")}
          descriptionText={
            <ButtonLink
              fontSize="sm"
              onClick={() => privacyNoticeFile.download()}
            >
              {t("personalArea.privacyNotice")}
            </ButtonLink>
          }
        />

        <ConfirmationCheckboxField
          name="confirmPrivacyPolicy"
          label={t("personalArea.confirmPrivacyPolicy")}
          descriptionText={
            <ButtonLink
              fontSize="sm"
              onClick={() => privacyPolicyFile.download()}
            >
              {t("personalArea.privacyPolicy")}
            </ButtonLink>
          }
        />
      </Stack>
      <Button type="submit">{t("personalArea.goToPersonalArea")}</Button>
    </FormPlus>
  );
}
