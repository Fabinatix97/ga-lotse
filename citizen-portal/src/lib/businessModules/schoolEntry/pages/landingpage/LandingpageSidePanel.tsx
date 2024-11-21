/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { useSchoolEntryPublicCitizenApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { useAccessCodeParam } from "@/lib/shared/helpers/accessCode";

export function LandingpageSidePanel() {
  const { t } = useTranslation(["schoolEntry/overview"]);
  const accessCode = useAccessCodeParam();
  const router = useRouter();
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
        onSubmit={handleConfirm}
        component={PrivacyPolicyConfirmationForm}
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
    <FormPlus style={{ display: "contents" }}>
      <Stack gap={1}>
        <ConfirmationCheckboxField
          name="confirmPrivacyNotice"
          label={t("personalArea.confirmPrivacyNotice")}
          descriptionText={
            <DownloadLink
              downloadContainerRef={privacyNoticeFile.downloadContainerRef}
              fontSize="sm"
              onDownload={() => privacyNoticeFile.download()}
            >
              {t("personalArea.privacyNotice")}
            </DownloadLink>
          }
        />

        <ConfirmationCheckboxField
          name="confirmPrivacyPolicy"
          label={t("personalArea.confirmPrivacyPolicy")}
          descriptionText={
            <DownloadLink
              downloadContainerRef={privacyPolicyFile.downloadContainerRef}
              fontSize="sm"
              onDownload={() => privacyPolicyFile.download()}
            >
              {t("personalArea.privacyPolicy")}
            </DownloadLink>
          }
        />
      </Stack>
      <Button type="submit">{t("personalArea.goToPersonalArea")}</Button>
    </FormPlus>
  );
}
