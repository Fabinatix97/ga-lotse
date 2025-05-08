/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  EmployeeInformationFormValues,
  MedicalRegistryCreateProcedureFormValues,
  PracticeInformationFormValues,
} from "@eshg/lib-portal/businessModules/medicalRegistry/medicalRegistryCreateProcedureFormValues";
import { shouldEnable } from "@eshg/lib-portal/businessModules/medicalRegistry/sections";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { EmailField } from "@eshg/lib-portal/components/formFields/EmailField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  useValidateLength,
  useValidateNumber,
} from "@eshg/lib-portal/hooks/useValidators";

import { requiredFieldMessageKey } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { useTranslation } from "@/lib/i18n/client";
import { allBreakpoints, byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function ProfessionalRegistrationFormStepThree() {
  const validateLength = useValidateLength();
  const validateNumber = useValidateNumber();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const proprietaryPractice =
    values.practiceInformationForm.proprietaryPractice;
  const changeType = values.generalInformationForm.changeType;
  const forceProprietaryPractice = !shouldEnable("practiceChoice", changeType);

  const practiceInformationForm =
    createFieldNameMapper<PracticeInformationFormValues>(
      "practiceInformationForm",
    );

  const employeeInformationForm =
    createFieldNameMapper<EmployeeInformationFormValues>(
      "employeeInformationForm",
    );

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <ContentSheet>
      <Typography level="h2">{t("stepThree.pageTitle")}</Typography>

      {shouldEnable("practice", changeType) && (
        <>
          {forceProprietaryPractice ? (
            <Alert color="primary" message={t("stepThree.hint")} />
          ) : (
            <>
              <Typography level="h4">
                {t("stepThree.subTitle.proprietaryPractice")}
              </Typography>
              <BooleanRadioField
                name={practiceInformationForm("proprietaryPractice")}
                dataTestId="proprietaryPractice"
                trueLabel={t("options.yes")}
                falseLabel={t("options.no")}
              />
            </>
          )}

          {(forceProprietaryPractice || proprietaryPractice) && (
            <>
              <Typography level="h4">
                {t("stepThree.subTitle.practiceInformation")}
              </Typography>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid {...allBreakpoints(12)}>
                  <InputField
                    name={practiceInformationForm("practiceName")}
                    label={t("stepThree.label.practiceName")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 300)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("street")}
                    label={t("stepThree.label.street")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 55)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("houseNumber")}
                    label={t("stepThree.label.houseNumber")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 11)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("postalCode")}
                    label={t("stepThree.label.postalCode")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 20)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("city")}
                    label={t("stepThree.label.city")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 50)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("phoneNumber")}
                    label={t("stepThree.label.phoneNumber")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 23)}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <EmailField
                    name={practiceInformationForm("email")}
                    label={t("stepThree.label.email")}
                    required={t(requiredFieldMessageKey)}
                    validate={validateLength(1, 254)}
                  />
                </Grid>
                <Grid {...allBreakpoints(12)}>
                  <InputField
                    name={practiceInformationForm("website")}
                    label={t("stepThree.label.website")}
                    validate={validateLength(6, 254)}
                  />
                </Grid>
                <Grid {...allBreakpoints(12)}>
                  <InputField
                    name={practiceInformationForm("openingHours")}
                    label={t("stepThree.label.openingHours")}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("institutionIdentifier")}
                    label={t("stepThree.label.institutionIdentifier")}
                    validate={validateNumber}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <InputField
                    name={practiceInformationForm("establishmentNumber")}
                    label={t("stepThree.label.establishmentNumber")}
                    validate={validateNumber}
                  />
                </Grid>
              </Grid>

              <BooleanRadioField
                name={practiceInformationForm("healthInsuranceAuthorization")}
                label={t("stepThree.subTitle.healthInsuranceAuthorization")}
                trueLabel={t("options.yes")}
                falseLabel={t("options.no")}
              />
            </>
          )}
        </>
      )}

      {shouldEnable("employees", changeType) && (
        <>
          <Typography level="h4">
            {t("stepThree.label.employeesEmployed")}
          </Typography>
          <BooleanRadioField
            name={employeeInformationForm("employeesEmployed")}
            dataTestId="employeesEmployed"
            trueLabel={t("options.yes")}
            falseLabel={t("options.no")}
          />
        </>
      )}
    </ContentSheet>
  );
}
