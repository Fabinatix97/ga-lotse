/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button, Grid, Sheet, Stack, Typography, styled } from "@mui/joy";
import { FieldArray, useFormikContext } from "formik";
import { useId, useMemo } from "react";

import {
  AddressAutoFillField,
  Alert,
  BooleanRadioField,
  DateField,
  EmailField,
  InputField,
  SelectField,
  SelectOption,
  StreetField,
  useValidateGermanZipCode,
  useValidateLength,
  useValidateNumber,
  useValidatePastOrTodayDate,
  validatePipe,
} from "@eshg/lib-portal";
import {
  EmployeeChangeEntry,
  EmployeeInformationFormValues,
  EmployeesFormValues,
  MedicalRegistryCreateProcedureFormValues,
  PracticeInformationFormValues,
  buildEmptyEmployeeChangeEntry,
  shouldEnableSection,
} from "@eshg/medical-registry";
import {
  ApiEmployeeChangeType,
  ApiTypeOfChange,
} from "@eshg/medical-registry-api";

import { requiredFieldMessageKey } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { useTranslation } from "@/lib/i18n/client";
import { usePublicStreetApi } from "@/lib/shared/api/clients";
import { allBreakpoints, byBreakpoint } from "@/lib/shared/breakpoints";
import { StyledRemoveButton } from "@/lib/shared/components/form/file/buttonVariants";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

const MAX_EMPLOYEES = 30;

export function ProfessionalRegistrationFormStepThree() {
  const publicStreetApi = usePublicStreetApi();
  const validateLength = useValidateLength();
  const validateNumber = useValidateNumber();
  const validateZipCode = useValidateGermanZipCode();
  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;

  const proprietaryPractice =
    values.practiceInformationForm.proprietaryPractice;
  const changeType = values.generalInformationForm.changeType;
  const forceProprietaryPractice = !shouldEnableSection(
    "practiceChoice",
    changeType,
  );

  const practiceInformationForm =
    createFieldNameMapper<PracticeInformationFormValues>(
      "practiceInformationForm",
    );

  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("stepThree.pageTitle")}</ContentSheetTitle>

      {shouldEnableSection("practice", changeType) && (
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
                  <StreetField
                    api={publicStreetApi}
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
                  <AddressAutoFillField
                    api={publicStreetApi}
                    name="postalCode"
                    fieldName={practiceInformationForm}
                    label={t("stepThree.label.postalCode")}
                    required={t(requiredFieldMessageKey)}
                    validate={validatePipe(
                      validateZipCode,
                      validateLength(1, 20),
                    )}
                  />
                </Grid>
                <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                  <AddressAutoFillField
                    api={publicStreetApi}
                    name="city"
                    fieldName={practiceInformationForm}
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

      {shouldEnableSection("employeeInfo", changeType) && (
        <EmployeeInfoSection />
      )}
      {shouldEnableSection("employees", changeType) && <EmployeesSection />}
    </ContentSheet>
  );
}

const employeeInformationForm =
  createFieldNameMapper<EmployeeInformationFormValues>(
    "employeeInformationForm",
  );

function EmployeeInfoSection() {
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;
  const { employeesEmployed } = values.employeeInformationForm;

  return (
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
      {employeesEmployed && (
        <Typography level="body-md" fontStyle="italic">
          {t("stepThree.label.employeesEmployedHint", {
            changeType: t(
              `options.changeTypeNames.${ApiTypeOfChange.ChangeOfEmployees}`,
            ),
          })}
        </Typography>
      )}
    </>
  );
}

const employeesForm =
  createFieldNameMapper<EmployeesFormValues>("employeesForm");
const employeeFieldName = createFieldNameMapper<EmployeeChangeEntry>();

function EmployeesSection() {
  const employeeGroupId = useId();
  const validateLength = useValidateLength();
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  const values =
    useFormikContext<MedicalRegistryCreateProcedureFormValues>().values;
  const { employees } = values.employeesForm;
  const canDeleteEmployeeEntries = employees.length > 1;
  const canAddEmployeeEntries = employees.length < MAX_EMPLOYEES;

  const translatedEmployeeChangeTypeOptions: SelectOption[] = useMemo(() => {
    const employeeChangeTypeValues = Object.values(ApiEmployeeChangeType);
    return employeeChangeTypeValues.map((value) => {
      return {
        value,
        label: t(`options.employeeChangeTypeNames.${value}`),
      };
    });
  }, [t]);

  return (
    <>
      <Typography level="h4">{t("stepThree.employeeSheet.title")}</Typography>

      <FieldArray name={employeesForm("employees")}>
        {({ push, remove }) => (
          <>
            {employees.map((_values, index) => (
              <StyledEmployeeSheet
                key={index}
                role="group"
                aria-labelledby={`${employeeGroupId}-${index}`}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    level="title-md"
                    id={`${employeeGroupId}-${index}`}
                  >
                    {t("stepThree.employeeSheet.subTitle")}
                  </Typography>

                  {canDeleteEmployeeEntries && (
                    <StyledRemoveButton
                      color="danger"
                      variant="plain"
                      sx={{ minHeight: "auto" }}
                      onClick={() => remove(index)}
                    >
                      {t("stepThree.employeeSheet.label.deleteEmployee")}
                    </StyledRemoveButton>
                  )}
                </Stack>

                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                    <InputField
                      name={`${employeesForm("employees")}.${index}.${employeeFieldName("firstName")}`}
                      label={t("stepThree.employeeSheet.label.firstName")}
                      required={t(requiredFieldMessageKey)}
                      validate={validateLength(1, 80)}
                    />
                  </Grid>
                  <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                    <InputField
                      name={`${employeesForm("employees")}.${index}.${employeeFieldName("lastName")}`}
                      label={t("stepThree.employeeSheet.label.lastName")}
                      required={t(requiredFieldMessageKey)}
                      validate={validateLength(1, 120)}
                    />
                  </Grid>
                  <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                    <DateField
                      name={`${employeesForm("employees")}.${index}.${employeeFieldName("dateOfBirth")}`}
                      label={t("stepThree.employeeSheet.label.birthDate")}
                      required={t(requiredFieldMessageKey)}
                      validate={validatePastOrTodayDate}
                    />
                  </Grid>
                  <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
                    <SelectField
                      name={`${employeesForm("employees")}.${index}.${employeeFieldName("changeType")}`}
                      label={t("stepThree.employeeSheet.label.changeType")}
                      options={translatedEmployeeChangeTypeOptions}
                      required={t(requiredFieldMessageKey)}
                      placeholder={t(
                        "stepThree.employeeSheet.label.changeTypePlaceholder",
                      )}
                      sx={{
                        "div:has(input), div:has(input):hover": {
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </StyledEmployeeSheet>
            ))}
            <Grid container justifyContent="center">
              <Button
                variant="outlined"
                endDecorator={<Add />}
                disabled={!canAddEmployeeEntries}
                onClick={() => push(buildEmptyEmployeeChangeEntry())}
              >
                {t("stepThree.employeeSheet.label.addEmployee")}
              </Button>
            </Grid>
          </>
        )}
      </FieldArray>
    </>
  );
}

const StyledEmployeeSheet = styled(Sheet)(({ theme }) => ({
  backgroundColor: theme.palette.background.level1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));
