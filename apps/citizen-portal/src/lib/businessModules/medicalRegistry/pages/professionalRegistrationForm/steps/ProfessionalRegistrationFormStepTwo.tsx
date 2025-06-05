/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Radio, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";

import {
  DateField,
  InputField,
  RadioGroupField,
  SelectField,
  buildEnumOptions,
  useValidateLength,
  useValidatePastOrTodayDate,
} from "@eshg/lib-portal";
import {
  MedicalRegistryCreateProcedureFormValues,
  OccupationalInformationFormValues,
  PROFESSIONAL_TITLE_NAMES,
  ProfessionalismInformationFormValues,
  shouldEnableSection,
  useValidateLifetimeDoctorNumber,
} from "@eshg/medical-registry";
import {
  ApiEmploymentStatus,
  ApiEmploymentType,
  ApiTypeOfChange,
} from "@eshg/medical-registry-api";

import { requiredFieldMessageKey } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { SelectionOption } from "@/lib/businessModules/travelMedicine/components/shared/CountryFieldMulti";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

const professionalTitleNamesOptions = buildEnumOptions(
  PROFESSIONAL_TITLE_NAMES,
);

export function ProfessionalRegistrationFormStepTwo() {
  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const validateLifetimeDoctorNumber = useValidateLifetimeDoctorNumber();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const changeType = values.generalInformationForm.changeType;

  const occupationalInformationForm =
    createFieldNameMapper<OccupationalInformationFormValues>(
      "occupationalInformationForm",
    );

  const professionalismInformationForm =
    createFieldNameMapper<ProfessionalismInformationFormValues>(
      "professionalismInformationForm",
    );

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  const translatedProfessionalTitleNamesOptions: SelectionOption[] = useMemo(
    () =>
      professionalTitleNamesOptions
        .map((option) => {
          return {
            value: option.value,
            label: t(`options.professionalTitleNames.${option.value}`),
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label)),
    [t],
  );

  return (
    <ContentSheet>
      <Typography level="h2">{t("stepTwo.pageTitle")}</Typography>
      {shouldEnableSection("profession", changeType) && (
        <>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <SelectField
                name={occupationalInformationForm("professionalTitle")}
                label={t("stepTwo.label.professionalTitle")}
                options={translatedProfessionalTitleNamesOptions}
                required={t(requiredFieldMessageKey)}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm("fieldOfExpertise")}
                label={t("stepTwo.label.fieldOfExpertise")}
                validate={validateLength(1, 100)}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm("specialistTitle")}
                label={t("stepTwo.label.specialistTitle")}
                validate={validateLength(1, 100)}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm("furtherTraining")}
                label={t("stepTwo.label.furtherTraining")}
                validate={validateLength(1, 300)}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm("qualifications")}
                label={t("stepTwo.label.qualifications")}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm("lifetimeDoctorNumber")}
                label={t("stepTwo.label.lifetimeDoctorNumber")}
                validate={validateLifetimeDoctorNumber}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <DateField
                name={occupationalInformationForm("approbationGrantedOn")}
                label={t("stepTwo.label.approbationGrantedOn")}
                required={
                  changeType === ApiTypeOfChange.NewRegistration ||
                  changeType === ApiTypeOfChange.ReRegistration
                    ? t(requiredFieldMessageKey)
                    : undefined
                }
                validate={validatePastOrTodayDate}
              />
            </Grid>
            <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
              <InputField
                name={occupationalInformationForm(
                  "approbationIssuingAuthority",
                )}
                label={t("stepTwo.label.approbationIssuingAuthority")}
                required={t(requiredFieldMessageKey)}
                validate={validateLength(1, 100)}
              />
            </Grid>
          </Grid>

          <Typography level="h4" marginTop={3}>
            {t("stepTwo.subTitle.professionalism")}
          </Typography>
          <RadioGroupField
            name={professionalismInformationForm("employmentType")}
            label={t("stepTwo.label.employmentType")}
            orientation="horizontal"
            required={t(requiredFieldMessageKey)}
          >
            <Radio
              value={ApiEmploymentType.FullTime}
              label={t("options.employmentType.FULL_TIME")}
            />
            <Radio
              value={ApiEmploymentType.PartTime}
              label={t("options.employmentType.PART_TIME")}
            />
          </RadioGroupField>
          <RadioGroupField
            name={professionalismInformationForm("employmentStatus")}
            label={t("stepTwo.label.employmentStatus")}
            orientation="horizontal"
            required={t(requiredFieldMessageKey)}
          >
            <Radio
              value={ApiEmploymentStatus.SelfEmployed}
              label={t("options.employmentStatus.SELF_EMPLOYED")}
            />
            <Radio
              value={ApiEmploymentStatus.Freelance}
              label={t("options.employmentStatus.FREELANCE")}
            />
            <Radio
              value={ApiEmploymentStatus.Employee}
              label={t("options.employmentStatus.EMPLOYEE")}
            />
          </RadioGroupField>
        </>
      )}
    </ContentSheet>
  );
}
