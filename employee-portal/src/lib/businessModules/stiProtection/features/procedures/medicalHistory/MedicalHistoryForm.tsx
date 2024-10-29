/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiStiProtectionProcedure,
  CreateMedicalHistoryRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  MonthAndYearFields,
  mapMonthAndYear,
} from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { Divider, FormLabel, Grid, Typography, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { subDays } from "date-fns";
import { FieldArray, Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";
import { useCreateMedicalHistory } from "@/lib/businessModules/stiProtection/api/mutations/medicalHistory";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import {
  CONCERN_VALUES,
  DiseaseType,
  diseaseTypeNames,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import {
  MedicalHistoryFormData,
  initialValues,
} from "./MedicalHistoryForm.config";
import { sexualContactOptions, sexualOrientationOptions } from "./options";

const AutoWidthHorizontalField = styled(HorizontalField)({
  ".MuiStack-root": {
    justifyContent: "space-between",
  },
});

function MedicalHistoryCommonFields({
  procedure,
}: {
  procedure: ApiStiProtectionProcedure;
}) {
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <>
      <Typography level="title-md" mt={1}>
        Allgemein
      </Typography>
      <FormGroupGrid>
        <Grid container xxs={12}>
          <Grid xxs={12} md={6} xxl={3}>
            <InputField
              name="examinationReason"
              label={
                <FormLabel title="Grund für die heutige Beratung">
                  Grund für die heutige Beratung
                </FormLabel>
              }
              component={AutoWidthHorizontalField}
            />
          </Grid>
        </Grid>
        {procedure.concern === "SEX_WORK" && (
          <Grid container xxs={12}>
            <Grid xxs={12} md={6} xxl={3} direction="column" container>
              <Grid>
                <DateField
                  name="lastMenstruation"
                  label="Letzte Menstruation vor"
                  component={AutoWidthHorizontalField}
                />
              </Grid>
              <Grid>
                <DateField
                  name="lastCancerScreening"
                  label="Letzte Krebsvorsorge vor"
                  component={AutoWidthHorizontalField}
                />
              </Grid>
            </Grid>
            <Grid xxs={12} md={6} xxl={3} direction="column" container>
              <Grid>
                <BooleanSelectField
                  name="hasBeenPregnant"
                  label="Bereits schwanger?"
                  component={AutoWidthHorizontalField}
                />
              </Grid>
              {!!values.hasBeenPregnant && (
                <>
                  <Grid ml={3}>
                    <NumberField
                      name="numberOfPregnancies"
                      label="Wenn ja, wie oft?"
                      component={AutoWidthHorizontalField}
                      required={"Bitte eine Zahl angeben"}
                    />
                  </Grid>
                  <Grid ml={3}>
                    <NumberField
                      name="numberOfBirthsOrAbortions"
                      label="Anzahl Geburten/Aborte"
                      component={AutoWidthHorizontalField}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid xxs={12} md={6} xxl={3}>
              <TextareaField
                name="knownOperationsOrIllnesses"
                label="Bekannte Operationen oder Erkrankungen"
                sx={{
                  fontWeight: 500,
                }}
              />
            </Grid>
            <Grid xxs={12} md={6} xxl={3}>
              <TextareaField
                name="medications"
                label="Medikamente"
                sx={{
                  fontWeight: 500,
                }}
              />
            </Grid>
          </Grid>
        )}
      </FormGroupGrid>
    </>
  );
}

export function MedicalHistoryForm({
  procedureId,
}: Readonly<{ procedureId: string }>) {
  const { data: stiProcedure } = useStiProcedureQuery(procedureId);

  const createMedicalHistory = useCreateMedicalHistory();
  const router = useRouter();

  const formTitle = `Anamnesebogen ${CONCERN_VALUES[stiProcedure.concern]}`;

  async function onSubmit(values: MedicalHistoryFormData) {
    const examinationsToReport = Object.entries(values.examinations).filter(
      ([_diseaseType, vaccinationDate]) => !!vaccinationDate,
    );

    const vaccinationsToReport = Object.entries(
      values.riskFactors.vaccinations,
    ).filter(([_diseaseType, vaccinationDate]) => !!vaccinationDate);

    const medicalHistoryRequest: CreateMedicalHistoryRequest["apiCreateMedicalHistoryRequest"] =
      {
        medicalHistory: {
          type: "StiConsultationMedicalHistory",
          ...(values.examinationReason && {
            examinationReason: values.examinationReason,
          }),
          ...(examinationsToReport && {
            examinations: Object.fromEntries(
              examinationsToReport.map(([diseaseType, vaccinationDate]) => [
                diseaseType as DiseaseType,
                mapMonthAndYear(vaccinationDate) ??
                  toUtcDate(toDateString(subDays(new Date(), 7))),
              ]),
            ),
          }),
          ...(values.sexualContact && {
            sexualContact: values.sexualContact,
          }),
          ...(values.sexualOrientation && {
            sexualOrientation: values.sexualOrientation,
          }),
          previousIllnesses: values.previousIllnesses,
          riskFactors: {
            prepInfoProvided: values.riskFactors.prepInfoProvided,
            ...(vaccinationsToReport && {
              vaccinations: Object.fromEntries(
                vaccinationsToReport.map(([diseaseType, vaccinationDate]) => [
                  diseaseType as DiseaseType,
                  mapMonthAndYear(vaccinationDate) ??
                    toUtcDate(toDateString(subDays(new Date(), 7))),
                ]),
              ),
            }),
          },
        },
      };

    await createMedicalHistory
      .mutateAsync(
        {
          id: procedureId,
          medicalHistory: medicalHistoryRequest,
        },
        {
          onSuccess: () => {
            router.push(routes.procedures.byId(procedureId).details);
          },
        },
      )
      .catch();
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, isSubmitting }) => (
        <>
          <FormSheet sx={{ overflow: "auto" }}>
            <Typography level="h3" mb={2}>
              {formTitle}
            </Typography>
            <Divider />
            <MedicalHistoryCommonFields procedure={stiProcedure} />
            <Divider />
            <Typography level="title-md" mt={1}>
              Untersuchungen
            </Typography>
            <Grid xxs={12} md={6}>
              <FieldArray name={"examinations"}>
                {() => (
                  <>
                    {Object.entries(values.examinations).map(
                      ([diseaseType, examinationDate]) => {
                        const showDateField = !!examinationDate;

                        return (
                          <Grid
                            key={diseaseType}
                            container
                            direction="row"
                            xxs={12}
                            lg={6}
                            mb={1}
                            rowSpacing={2}
                            rowGap={1}
                          >
                            <Grid xxs={12} md={4}>
                              <BooleanSelectField
                                name={`examinations.${diseaseType}.hadExamination`}
                                label={
                                  diseaseTypeNames[diseaseType as DiseaseType]
                                }
                                component={AutoWidthHorizontalField}
                                sx={{ mr: 1 }}
                              />
                            </Grid>
                            <Grid
                              xxs={12}
                              md={8}
                              sx={{
                                ml: {
                                  xxs: 3,
                                  md: "inherit",
                                },
                                ...fadeInOut(showDateField),
                              }}
                            >
                              <MonthAndYearFields
                                fieldName={`examinations.${diseaseType}.examinationDate`}
                                date={examinationDate}
                              />
                            </Grid>
                          </Grid>
                        );
                      },
                    )}
                  </>
                )}
              </FieldArray>
            </Grid>
            <Divider />
            <Typography level="title-md" mt={1}>
              Bisherige Krankheiten
            </Typography>
            <Divider />
            <Typography level="title-md" mt={1}>
              Sexuelle Orientierung / Kontakte
            </Typography>
            <FormGroupGrid>
              <Grid xxs={12} md={4}>
                <SelectField
                  name="sexualOrientation"
                  label="Sexuelle Orientierung"
                  options={sexualOrientationOptions}
                />
              </Grid>
              <Grid xxs={12} md={4}>
                <NumberField
                  name="numberOfSexualPartners"
                  label={
                    <FormLabel
                      sx={multiLineEllipsis(1)}
                      title="Anzahl der Sexpartner:innen in den letzten 12 Monaten"
                    >
                      Anzahl der Sexpartner:innen in den letzten 12 Monaten
                    </FormLabel>
                  }
                  required="Bitte eine Zahl eingeben"
                />
              </Grid>
              <Grid xxs={12} md={4}>
                <SelectField
                  name="sexualContact"
                  label="Sexueller Kontakt"
                  options={sexualContactOptions}
                />
              </Grid>
            </FormGroupGrid>
            <Divider />
            <Typography level="title-md" mt={1}>
              Risiko und Prävention
            </Typography>
            <Divider />
            <Typography level="title-md" mt={1}>
              Impfungen
            </Typography>
            <Grid xxs={12} md={6}>
              <FieldArray name={"vaccinations"}>
                {() => (
                  <>
                    {Object.entries(values.riskFactors.vaccinations).map(
                      ([diseaseType, vaccinationDate]) => {
                        const showDateField = !!vaccinationDate;

                        return (
                          <Grid
                            key={diseaseType}
                            container
                            direction="row"
                            xxs={12}
                            lg={6}
                            mb={1}
                            rowSpacing={2}
                            rowGap={1}
                          >
                            <Grid xxs={12} md={4}>
                              <BooleanSelectField
                                name={`vaccinations.${diseaseType}.hadVaccination`}
                                label={
                                  diseaseTypeNames[diseaseType as DiseaseType]
                                }
                                component={AutoWidthHorizontalField}
                                sx={{ mr: 1 }}
                              />
                            </Grid>
                            <Grid
                              xxs={12}
                              md={8}
                              sx={{
                                ml: {
                                  xxs: 3,
                                  md: "inherit",
                                },
                                ...fadeInOut(showDateField),
                              }}
                            >
                              <MonthAndYearFields
                                fieldName={`vaccinations.${diseaseType}.vaccinationDate`}
                                date={vaccinationDate}
                              />
                            </Grid>
                          </Grid>
                        );
                      },
                    )}
                  </>
                )}
              </FieldArray>
            </Grid>
            <Divider />
            <Grid xxs={12}>
              <TextareaField name="notes" label="Bemerkungen" />
            </Grid>
            <StickyBottomButtonBar
              right={
                <>
                  <InternalLinkButton
                    href={routes.procedures.byId(procedureId).details}
                    variant="plain"
                  >
                    Abbrechen
                  </InternalLinkButton>
                  <SubmitButton submitting={isSubmitting}>
                    Speichern
                  </SubmitButton>
                </>
              }
            ></StickyBottomButtonBar>
          </FormSheet>
        </>
      )}
    </Formik>
  );
}

function fadeInOut(shouldFadeIn: boolean): SxProps {
  return {
    visibility: shouldFadeIn ? "visible" : "hidden",
    opacity: shouldFadeIn ? 1 : 0,
    height: shouldFadeIn ? "100%" : 0,
    transition: "all ease-in-out 0.4s",
    "@media (prefers-reduced-motion)": {
      transition: "none",
    },
  };
}
