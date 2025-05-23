/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { ButtonLink, useFileDownload } from "@eshg/lib-portal";

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
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyNoticeFile.download()}
          >
            {t("confirmationSection.fields.privacyNotice")}
          </ButtonLink>
        }
        required={t("confirmationSection.fields.confirmPrivacyNotice_required")}
      />
      <ConfirmationCheckboxField
        name="confirmPrivacyPolicy"
        label={t("confirmationSection.fields.confirmPrivacyPolicy")}
        descriptionText={
          <ButtonLink
            fontSize="sm"
            onClick={() => privacyPolicyFile.download()}
          >
            {t("confirmationSection.fields.privacyPolicy")}
          </ButtonLink>
        }
        required={t("confirmationSection.fields.confirmPrivacyPolicy_required")}
      />
    </Stack>
  );
}
