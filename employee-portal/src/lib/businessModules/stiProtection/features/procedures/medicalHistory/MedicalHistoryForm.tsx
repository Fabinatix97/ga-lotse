/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetMedicalHistory200Response,
  CreateMedicalHistoryRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { mapMonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { toDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { Divider, Grid, Typography, styled } from "@mui/joy";
import { FieldArray, Formik } from "formik";
import { useRouter } from "next/navigation";

import { useCreateMedicalHistory } from "@/lib/businessModules/stiProtection/api/mutations/medicalHistory";
import { useStiProcedureQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import {
  CONCERN_VALUES,
  DiseaseType,
  diseaseTypeNames,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import {
  BooleanSelectDate,
  booleanSelectGroupGridProps,
} from "./BooleanSelectDate";
import {
  MedicalHistoryFormData,
  defaultMedicalHistoryFormValues,
  medicalHistoryFormFields as fields,
  medicalHistoryFormSections as sections,
} from "./MedicalHistoryForm.config";
import { firstDayOfCurrentMonth, mapToFormValues } from "./helpers";
import { MedicalHistoryCommonFields } from "./sections/MedicalHistoryCommonFields";
import { SexualOrientationAndContact } from "./sections/SexualOrientationAndContact";

export const AutoWidthHorizontalField = styled(HorizontalField)({
  ".MuiStack-root": {
    justifyContent: "space-between",
  },
});

export function MedicalHistoryForm({
  procedureId,
  medicalHistory,
}: Readonly<{
  procedureId: string;
  medicalHistory?: ApiGetMedicalHistory200Response | null;
}>) {
  const { data: stiProcedure } = useStiProcedureQuery(procedureId);

  const createMedicalHistory = useCreateMedicalHistory();
  const router = useRouter();

  const formTitle = `Anamnesebogen ${CONCERN_VALUES[stiProcedure.concern]}`;

  async function onSubmit(values: MedicalHistoryFormData) {
    const examinationsToReport = Object.entries(values.examinations).filter(
      ([_diseaseType, { hadExamination }]) => !!hadExamination,
    );
    const vaccinationsToReport = Object.entries(
      values.riskFactors.vaccinations,
    ).filter(([_diseaseType, { hadVaccination }]) => !!hadVaccination);

    const medicalHistoryRequest: CreateMedicalHistoryRequest["apiCreateMedicalHistoryRequest"] =
      {
        medicalHistory: {
          type:
            stiProcedure.concern === "SEX_WORK"
              ? "SexWorkMedicalHistory"
              : "StiConsultationMedicalHistory",
          ...(values.examinationReason && {
            examinationReason: values.examinationReason,
          }),
          ...(examinationsToReport && {
            examinations: Object.fromEntries(
              examinationsToReport.map(([diseaseType, { examinationDate }]) => [
                diseaseType as DiseaseType,
                mapMonthAndYear(examinationDate) ??
                  toUtcDate(toDateString(firstDayOfCurrentMonth())),
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
                vaccinationsToReport.map(
                  ([diseaseType, { vaccinationDate }]) => [
                    diseaseType as DiseaseType,
                    mapMonthAndYear(vaccinationDate) ??
                      toUtcDate(toDateString(firstDayOfCurrentMonth())),
                  ],
                ),
              ),
            }),
          },
        },
      };

    await createMedicalHistory.mutateAsync(
      {
        id: procedureId,
        medicalHistory: medicalHistoryRequest,
      },
      {
        onSuccess: () => {
          router.push(routes.procedures.byId(procedureId).details);
        },
      },
    );
  }

  return (
    <Formik
      initialValues={
        medicalHistory
          ? mapToFormValues(medicalHistory)
          : defaultMedicalHistoryFormValues(stiProcedure)
      }
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting }) => (
        <>
          <FormSheet sx={{ overflow: "auto" }}>
            <Typography level="h3" mb={2}>
              {formTitle}
            </Typography>
            <Divider />
            <MedicalHistoryCommonFields procedure={stiProcedure} />
            <Divider />
            <SexualOrientationAndContact />
            <Divider />
            <Typography level="title-md" mt={1} id="examinations-section-title">
              {sections.examinations}
            </Typography>
            <Grid
              xxs={12}
              md={6}
              component="section"
              aria-labelledby="examinations-section-title"
            >
              <FieldArray name={"examinations"}>
                {() => (
                  <>
                    {Object.entries(values.examinations).map(
                      ([diseaseType, { examinationDate, hadExamination }]) => {
                        const showDateField = !!hadExamination;

                        return (
                          <BooleanSelectDate
                            key={diseaseType}
                            date={examinationDate}
                            diseaseType={diseaseType as DiseaseType}
                            fieldNameDate={`examinations.${diseaseType}.examinationDate`}
                            fieldNameSelect={`examinations.${diseaseType}.hadExamination`}
                            showDateField={showDateField}
                          />
                        );
                      },
                    )}
                  </>
                )}
              </FieldArray>
            </Grid>
            <Divider />
            <Typography level="title-md" mt={1}>
              {sections.riskAndPrevention}
            </Typography>
            <Divider />
            <Typography
              level="title-md"
              mt={1}
              id="previous-illnesses-section-title"
            >
              {sections.previousIllnesses}
            </Typography>
            <Grid
              component="section"
              xxs={12}
              md={6}
              aria-labelledby="previous-illnesses-section-title"
            >
              <FieldArray name={"previousIllnesses"}>
                {() => (
                  <Grid {...booleanSelectGroupGridProps}>
                    {Object.entries(values.previousIllnesses).map(
                      ([diseaseType, _hadPreviousIllness]) => (
                        <Grid key={diseaseType} mb={1}>
                          <Grid xxs={12} md={6}>
                            <BooleanSelectField
                              name={`previousIllnesses.${diseaseType}`}
                              label={
                                diseaseTypeNames[diseaseType as DiseaseType]
                              }
                              component={AutoWidthHorizontalField}
                              sx={{ mr: 1 }}
                            />
                          </Grid>
                        </Grid>
                      ),
                    )}
                  </Grid>
                )}
              </FieldArray>
              <Grid xxs={12} lg={3}>
                <TextareaField
                  name="contactToClarifyDuration"
                  label={fields.contactToClarifyDuration}
                />
              </Grid>
            </Grid>
            <Divider />
            <Typography level="title-md" mt={1} id="vaccinations-section-title">
              {sections.vaccinations}
            </Typography>
            <Grid
              component="section"
              aria-labelledby="vaccinations-section-title"
              xxs={12}
              md={6}
            >
              <FieldArray name={"vaccinations"}>
                {() => (
                  <>
                    {Object.entries(values.riskFactors.vaccinations).map(
                      ([diseaseType, { vaccinationDate, hadVaccination }]) => {
                        const showDateField = !!hadVaccination;

                        return (
                          <BooleanSelectDate
                            key={diseaseType}
                            date={vaccinationDate}
                            diseaseType={diseaseType as DiseaseType}
                            fieldNameDate={`riskFactors.vaccinations.${diseaseType}.vaccinationDate`}
                            fieldNameSelect={`riskFactors.vaccinations.${diseaseType}.hadVaccination`}
                            showDateField={showDateField}
                          />
                        );
                      },
                    )}
                  </>
                )}
              </FieldArray>
            </Grid>
            <Divider />
            <Grid xxs={12}>
              <TextareaField name="remarks" label={fields.remarks} />
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
