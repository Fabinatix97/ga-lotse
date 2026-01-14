/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";

import {
  AddressAutoFillField,
  DateField,
  EmailField,
  GENDER_OPTIONS,
  InputField,
  PhoneNumberField,
  SelectField,
  StreetField,
  buildEnumOptions,
  useValidateLength,
  useValidatePastOrTodayDate,
  useValidateZipCode,
  validatePipe,
} from "@eshg/lib-portal";
import {
  CHANGE_TYPE_NAMES,
  GeneralInformationFormValues,
  MedicalRegistryCreateProcedureFormValues,
  PersonalInformationFormValues,
} from "@eshg/medical-registry";
import { ApiCountryCode, ApiTypeOfChange } from "@eshg/medical-registry-api";

import { requiredFieldMessageKey } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { SelectionOption } from "@/lib/businessModules/travelMedicine/components/shared/CountryFieldMulti";
import { useTranslation } from "@/lib/i18n/client";
import { usePublicStreetApi } from "@/lib/shared/api/clients";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { CountryField } from "@/lib/shared/components/form/CountryField";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

const changeTypeNamesOptions = buildEnumOptions(CHANGE_TYPE_NAMES);

export function ProfessionalRegistrationFormStepOne() {
  const publicStreetApi = usePublicStreetApi();

  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const validateZipCode = useValidateZipCode();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const changeType = values.generalInformationForm.changeType;

  const generalInformationForm =
    createFieldNameMapper<GeneralInformationFormValues>(
      "generalInformationForm",
    );

  const personalInformationForm =
    createFieldNameMapper<PersonalInformationFormValues>(
      "personalInformationForm",
    );

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  const translatedGenderOptions: SelectionOption[] = useMemo(
    () =>
      GENDER_OPTIONS.map((option) => {
        return {
          value: option.value,
          label: t(`options.gender.${option.value}`),
        };
      }),
    [t],
  );

  const translatedChangeTypeNamesOptions: SelectionOption[] = useMemo(
    () =>
      changeTypeNamesOptions.map((option) => {
        return {
          value: option.value,
          label: t(`options.changeTypeNames.${option.value}`),
        };
      }),
    [t],
  );

  return (
    <>
      <ContentSheet sx={{ marginBottom: 2 }}>
        <ContentSheetTitle>
          {t("stepOne.contentSheetOne.pageTitle")}
        </ContentSheetTitle>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <SelectField
              name={generalInformationForm("changeType")}
              label={t("stepOne.contentSheetOne.label.changeType")}
              options={translatedChangeTypeNamesOptions}
              required={t(requiredFieldMessageKey)}
            />
          </Grid>
        </Grid>
      </ContentSheet>
      <ContentSheet>
        <ContentSheetTitle>
          {t("stepOne.contentSheetTwo.pageTitle")}
        </ContentSheetTitle>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("title")}
              label={t("stepOne.contentSheetTwo.label.title")}
              validate={validateLength(1, 119)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <SelectField
              name={personalInformationForm("gender")}
              label={t("stepOne.contentSheetTwo.label.gender")}
              options={translatedGenderOptions}
              required={t(requiredFieldMessageKey)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("firstName")}
              label={t("stepOne.contentSheetTwo.label.firstName")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 120)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("lastName")}
              label={t("stepOne.contentSheetTwo.label.lastName")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 80)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("birthName")}
              label={t("stepOne.contentSheetTwo.label.birthName")}
              required={
                changeType === ApiTypeOfChange.ChangeOfName
                  ? t(requiredFieldMessageKey)
                  : undefined
              }
              validate={validateLength(1, 40)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              name={personalInformationForm("birthDate")}
              label={t("stepOne.contentSheetTwo.label.birthDate")}
              required={t(requiredFieldMessageKey)}
              validate={validatePastOrTodayDate}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("birthPlace")}
              label={t("stepOne.contentSheetTwo.label.birthPlace")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 50)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <CountryField
              name={personalInformationForm("nationality")}
              label={t("stepOne.contentSheetTwo.label.nationality")}
              required={t(requiredFieldMessageKey)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <StreetField
              api={publicStreetApi}
              name={personalInformationForm("street")}
              label={t("stepOne.contentSheetTwo.label.street")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 55)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={personalInformationForm("houseNumber")}
              label={t("stepOne.contentSheetTwo.label.houseNumber")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 11)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <AddressAutoFillField
              api={publicStreetApi}
              fieldName={personalInformationForm}
              name="postalCode"
              label={t("stepOne.contentSheetTwo.label.postalCode")}
              required={t(requiredFieldMessageKey)}
              validate={validatePipe(
                validateZipCode(
                  values.personalInformationForm.country || ApiCountryCode.De,
                ),
                validateLength(1, 20),
              )}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <AddressAutoFillField
              api={publicStreetApi}
              fieldName={personalInformationForm}
              name="city"
              label={t("stepOne.contentSheetTwo.label.city")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 50)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <CountryField
              name={personalInformationForm("country")}
              label={t("stepOne.contentSheetTwo.label.country")}
              required={t(requiredFieldMessageKey)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <EmailField
              name={personalInformationForm("email")}
              label={t("stepOne.contentSheetTwo.label.email")}
              validate={validateLength(1, 254)}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <PhoneNumberField
              name={personalInformationForm("phoneNumber")}
              label={t("stepOne.contentSheetTwo.label.phoneNumber")}
              required={t(requiredFieldMessageKey)}
              validate={validateLength(1, 23)}
            />
          </Grid>
        </Grid>
      </ContentSheet>
    </>
  );
}
