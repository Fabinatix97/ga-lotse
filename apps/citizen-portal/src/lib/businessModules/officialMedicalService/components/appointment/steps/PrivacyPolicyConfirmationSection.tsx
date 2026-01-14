/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { ButtonLink, useFileDownload } from "@eshg/lib-portal";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { useTranslation } from "@/lib/i18n/client";
import { ConfirmationCheckboxField } from "@/lib/shared/components/form/ConfirmationCheckboxField";

export function PrivacyPolicyConfirmationSection() {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
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
        label={t("confirmation.fields.confirmPrivacyNotice")}
        descriptionText={
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyNoticeFile.download()}
          >
            {t("confirmation.fields.privacyNotice")}
          </ButtonLink>
        }
        required={t("confirmation.fields.confirmPrivacyNotice_required")}
      />
      <ConfirmationCheckboxField
        name="confirmPrivacyPolicy"
        label={t("confirmation.fields.confirmPrivacyPolicy")}
        descriptionText={
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyPolicyFile.download()}
          >
            {t("confirmation.fields.privacyPolicy")}
          </ButtonLink>
        }
        required={t("confirmation.fields.confirmPrivacyPolicy_required")}
      />
    </Stack>
  );
}
