/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { CheckboxField } from "@/lib/businessModules/travelMedicine/components/shared/components/formField/CheckboxField";
import { useTranslation } from "@/lib/i18n/client";

export function PrivacyPolicyConfirmationSection() {
  const { t } = useTranslation(["travelMedicine/forms"]);

  return (
    <>
      <Stack gap={1}>
        <CheckboxField
          name="confirmPrivacyPolicy"
          label={t("confirmationSection.fields.confirmPrivacyPolicy")}
          required={t(
            "confirmationSection.fields.confirmPrivacyPolicy_required",
          )}
        />
        <CheckboxField
          name="confirmPrivacyNotice"
          label={t("confirmationSection.fields.confirmPrivacyNotice")}
          required={t(
            "confirmationSection.fields.confirmPrivacyNotice_required",
          )}
        />
      </Stack>
    </>
  );
}
