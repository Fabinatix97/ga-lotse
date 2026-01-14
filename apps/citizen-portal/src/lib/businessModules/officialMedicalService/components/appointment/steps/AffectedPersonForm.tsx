/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import {
  CheckboxField,
  DateField,
  EmailField,
  InputField,
  PhoneNumberField,
  SelectField,
  useValidateGermanZipCode,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";
import { ApiAffectedPerson } from "@eshg/official-medical-service-api";

import {
  salutationOptions,
  titleOptions,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function AffectedPersonForm(props: { name: string }) {
  const { t } = useTranslation(["officialMedicalService/appointment"]);
  const validateLength = useValidateLength();
  const validateZipCode = useValidateGermanZipCode();
  const fieldName = createFieldNameMapper<ApiAffectedPerson>(props.name);

  return (
    <ContentSheet data-testid="personal-data-form">
      <FormSheetTitle requiredTitle={t("common.requiredTitle")}>
        {t("affectedPerson.title")}
      </FormSheetTitle>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xxs={12} xs={6}>
          <SelectField
            name={fieldName("salutation")}
            label={t("affectedPerson.fields.salutation")}
            options={salutationOptions(t)}
          />
        </Grid>
        <Grid xxs={12} xs={6}>
          <SelectField
            name={fieldName("title")}
            label={t("affectedPerson.fields.title")}
            options={titleOptions(t)}
            validate={validateLength(1, 119)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <InputField
            name={fieldName("firstName")}
            label={t("affectedPerson.fields.firstName")}
            required={t("affectedPerson.fields.firstName_required")}
            validate={validateLength(1, 80)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <InputField
            name={fieldName("lastName")}
            label={t("affectedPerson.fields.lastName")}
            required={t("affectedPerson.fields.lastName_required")}
            validate={validateLength(1, 120)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <InputField
            name={fieldName("nameAtBirth")}
            label={t("affectedPerson.fields.nameAtBirth")}
            validate={validateLength(1, 40)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <DateField
            name={fieldName("dateOfBirth")}
            label={t("affectedPerson.fields.dateOfBirth")}
            required={t("affectedPerson.fields.dateOfBirth_required")}
            validate={validateDateOfBirth}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 10 })}>
          <InputField
            name={`${fieldName("contactAddress")}.street`}
            label={t("affectedPerson.fields.contactAddress.street")}
            required={t("affectedPerson.fields.contactAddress.street_required")}
            validate={validateLength(1, 55)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 2 })}>
          <InputField
            name={`${fieldName("contactAddress")}.houseNumber`}
            label={t("affectedPerson.fields.contactAddress.houseNumber")}
            required={t(
              "affectedPerson.fields.contactAddress.houseNumber_required",
            )}
            validate={validateLength(1, 11)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <InputField
            name={`${fieldName("contactAddress")}.addressAddition`}
            label={t("affectedPerson.fields.contactAddress.addressAddition")}
            validate={validateLength(1, 100)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 2 })}>
          <InputField
            name={`${fieldName("contactAddress")}.postalCode`}
            label={t("affectedPerson.fields.contactAddress.postalCode")}
            required={t(
              "affectedPerson.fields.contactAddress.postalCode_required",
            )}
            validate={validateZipCode}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 10 })}>
          <InputField
            name={`${fieldName("contactAddress")}.city`}
            label={t("affectedPerson.fields.contactAddress.city")}
            required={t("affectedPerson.fields.contactAddress.city_required")}
            validate={validateLength(1, 50)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <PhoneNumberField
            name={fieldName("phoneNumbers")}
            label={t("affectedPerson.fields.phoneNumbers")}
            validate={validateLength(1, 23)}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <EmailField
            name={fieldName("emailAddresses")}
            label={t("affectedPerson.fields.emailAddresses")}
            required={t("affectedPerson.fields.emailAddresses_required")}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
          <CheckboxField
            name="confirmOnlineServices"
            label={t("affectedPerson.fields.confirmOnlineServices")}
            required={t("affectedPerson.fields.confirmOnlineServices_required")}
          />
        </Grid>
      </Grid>
    </ContentSheet>
  );
}
