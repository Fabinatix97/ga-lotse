/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";
import { Stack } from "@mui/joy";

import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { CheckboxField } from "@/lib/businessModules/travelMedicine/components/shared/components/formField/CheckboxField";
import { useTranslation } from "@/lib/i18n/client";

export function PersonalDataStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);
  const { validateLength, validatePastOrTodayDate } = useValidators();

  return (
    <FormSheet data-testid="personal-data-content-form">
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("personalDataFormContent.title")}
      </FormSheetTitle>
      <Stack gap={2} sx={{ ".MuiFormLabel-root": { fontWeight: "sm" } }}>
        <InputField
          name={"patient.firstName"}
          label={t("personalDataFormContent.fields.firstName")}
          required={t("personalDataFormContent.fields.firstName_required")}
          validate={validateLength(1, 80)}
        />
        <InputField
          name={"patient.lastName"}
          label={t("personalDataFormContent.fields.lastName")}
          required={t("personalDataFormContent.fields.lastName_required")}
          validate={validateLength(1, 120)}
        />
        <DateField
          name={"patient.dateOfBirth"}
          label={t("personalDataFormContent.fields.dateOfBirth")}
          required={t("personalDataFormContent.fields.dateOfBirth_required")}
          validate={validatePastOrTodayDate}
        />
        <InputField
          name={"patient.phoneNumbers"}
          label={t("personalDataFormContent.fields.phoneNumbers")}
          // validate={validateLength(1, 23)} // toDo: add validatation
        />
        <EmailField
          name={"patient.emailAddresses"}
          label={t("personalDataFormContent.fields.emailAddresses")}
          required={t("personalDataFormContent.fields.emailAddresses_required")}
        />
        <CheckboxField
          name={"confirmOnlineServices"}
          label={t("personalDataFormContent.fields.confirmOnlineServices")}
          required={t(
            "personalDataFormContent.fields.confirmOnlineServices_required",
          )}
          sx={(theme) => ({
            label: { ...theme.typography["body-md"], marginBottom: 0 },
            alignItems: "center",
          })}
        />
      </Stack>
    </FormSheet>
  );
}
