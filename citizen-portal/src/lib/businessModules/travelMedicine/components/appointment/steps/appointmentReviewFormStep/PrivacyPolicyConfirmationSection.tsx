/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { Stack } from "@mui/joy";

import { useCitizenPublicApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";

export function PrivacyPolicyConfirmationSection() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const citizenPublicApi = useCitizenPublicApi();
  const privacyNoticeFile = useFileDownload(() =>
    citizenPublicApi.getPrivacyNoticeRaw(),
  );
  const privacyPolicyFile = useFileDownload(() =>
    citizenPublicApi.getPrivacyPolicyRaw(),
  );

  return (
    <Stack gap={1}>
      <ConfirmationCheckboxField
        name="confirmPrivacyNotice"
        label={t("confirmationSection.fields.confirmPrivacyNotice")}
        descriptionText={
          <DownloadLink
            downloadContainerRef={privacyNoticeFile.downloadContainerRef}
            fontSize="sm"
            onDownload={() => privacyNoticeFile.download()}
          >
            {t("confirmationSection.fields.privacyNotice")}
          </DownloadLink>
        }
        required={t("confirmationSection.fields.confirmPrivacyNotice_required")}
      />
      <ConfirmationCheckboxField
        name="confirmPrivacyPolicy"
        label={t("confirmationSection.fields.confirmPrivacyPolicy")}
        descriptionText={
          <DownloadLink
            downloadContainerRef={privacyPolicyFile.downloadContainerRef}
            fontSize="sm"
            onDownload={() => privacyPolicyFile.download()}
          >
            {t("confirmationSection.fields.privacyPolicy")}
          </DownloadLink>
        }
        required={t("confirmationSection.fields.confirmPrivacyPolicy_required")}
      />
    </Stack>
  );
}
