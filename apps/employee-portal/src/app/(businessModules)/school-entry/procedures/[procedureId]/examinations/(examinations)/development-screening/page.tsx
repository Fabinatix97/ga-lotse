/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import { ContentPanel, ContentPanelTitle } from "@eshg/lib-employee-portal";
import {
  DisabledFormProvider,
  DynamicPageProps,
  mapOptionalValue,
  parseOptionalValue,
  useHandledMutation,
} from "@eshg/lib-portal";
import {
  type ApiExaminationWithDiagnosis,
  ApiHandicap,
  ApiHandicapWithDiagnosis,
  ApiMeasurements,
  ApiPhysicalExamination,
  ApiPsychoSocialRisk,
  ApiSocioEducationalPerformance,
  UpdateDevelopmentScreeningResultRequest,
} from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { DevelopmentScreeningResult } from "@/lib/businessModules/schoolEntry/api/models/examinations/DevelopmentScreeningResult";
import { useUpdateDevelopmentScreeningResultOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  getDevelopmentScreeningResultQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import {
  DevelopmentScreeningForm,
  DevelopmentScreeningFormValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/DevelopmentScreeningForm";
import { HandicapFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/HandicapFields";
import { HandicapWithDiagnosisFieldValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/HandicapWithDiagnosisFields";
import { MeasurementFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/MeasurementFields";
import { PhysicalExaminationFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/PhysicalExaminationFields";
import { PsychoSocialRiskFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/PsychoSocialRiskFields";
import { SocioEducationalFieldsValues } from "@/lib/businessModules/schoolEntry/features/procedures/developmentScreening/SocioEducationalFields";
import { ExaminationWithDiagnosisFieldValues } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/ExaminationWithDiagnosisFields";

export default function SchoolEntryDevelopmentScreeningPage(
  props: DynamicPageProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);
  const schoolEntryApi = useSchoolEntryApi();
  const [{ data: procedure }, { data: developmentScreeningResult }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getDevelopmentScreeningResultQuery(schoolEntryApi, procedureId),
      ],
    });
  const updateDevelopmentScreeningResultOptions =
    useUpdateDevelopmentScreeningResultOptions();
  const updateDevelopmentScreeningResult = useHandledMutation(
    updateDevelopmentScreeningResultOptions,
  );

  async function handleSubmit(formValues: DevelopmentScreeningFormValues) {
    await updateDevelopmentScreeningResult.mutateAsync(
      mapToRequest(procedureId, formValues, developmentScreeningResult.version),
    );
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>S1 Befund</ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <DevelopmentScreeningForm
          procedureId={procedureId}
          initialValues={mapToFormValues(developmentScreeningResult)}
          initialPercentiles={developmentScreeningResult.percentiles}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateDevelopmentScreeningResultOptions,
            variableSupplier: () =>
              mapToRequest(
                procedureId,
                values,
                developmentScreeningResult.version,
              ),
          })}
          onSubmit={handleSubmit}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

function mapToFormValues(
  developmentScreeningResult: DevelopmentScreeningResult,
): DevelopmentScreeningFormValues {
  return {
    measurements: parseMeasurements(developmentScreeningResult.measurements),
    physicalExamination: parsePhysicalExamination(
      developmentScreeningResult.physicalExamination,
    ),
    handicap: parseHandicap(developmentScreeningResult.handicap),
    psychoSocialRisk: parsePsychoSocialRisk(
      developmentScreeningResult.psychoSocialRisk,
    ),
    socioEducationalPerformance: parseSocioEducationalPerformance(
      developmentScreeningResult.socioEducationalPerformance,
    ),
    extraEffort: parseOptionalValue(developmentScreeningResult.extraEffort),
    schoolRecommendation: parseOptionalValue(
      developmentScreeningResult.schoolRecommendation,
    ),
    schoolFeedback: parseOptionalValue(
      developmentScreeningResult.schoolFeedback,
    ),
  };
}

function parseMeasurements(measurements: ApiMeasurements) {
  return {
    height: parseOptionalValue(measurements.height),
    weight: parseOptionalValue(measurements.weight),
    systole: parseOptionalValue(measurements.systole),
    diastole: parseOptionalValue(measurements.diastole),
  };
}

function parsePhysicalExamination(physicalExamination: ApiPhysicalExamination) {
  return {
    nutritionalCondition: parseExaminationResultWithDiagnosis(
      physicalExamination.nutritionalCondition,
    ),
    neurology: parseExaminationResultWithDiagnosis(
      physicalExamination.neurology,
    ),
    respiratoryCardiovascular: parseExaminationResultWithDiagnosis(
      physicalExamination.respiratoryCardiovascular,
    ),
    skin: parseExaminationResultWithDiagnosis(physicalExamination.skin),
    musculatureSkeleton: parseExaminationResultWithDiagnosis(
      physicalExamination.musculatureSkeleton,
    ),
    metabolism: parseExaminationResultWithDiagnosis(
      physicalExamination.metabolism,
    ),
    abdomen: parseExaminationResultWithDiagnosis(physicalExamination.abdomen),
    earNoseThroat: parseExaminationResultWithDiagnosis(
      physicalExamination.earNoseThroat,
    ),
    note: parseOptionalValue(physicalExamination.note),
  };
}

function parseHandicap(handicap: ApiHandicap): HandicapFieldsValues {
  return {
    chronicDisease: parseHandicapWithDiagnosis(handicap.chronicDisease),
    disability: parseHandicapWithDiagnosis(handicap.disability),
    disabilityType: parseOptionalValue(handicap.disabilityType),
    note: parseOptionalValue(handicap.note),
  };
}

function parseHandicapWithDiagnosis(
  handicapWithDiagnosis: ApiHandicapWithDiagnosis,
) {
  return {
    result: parseOptionalValue(handicapWithDiagnosis.result),
    icd10Codes: handicapWithDiagnosis.icd10Codes ?? [],
  };
}

function parsePsychoSocialRisk(
  psychoSocialRisk: ApiPsychoSocialRisk,
): PsychoSocialRiskFieldsValues {
  return {
    family: parseOptionalValue(psychoSocialRisk.family),
    nonCompliance: parseOptionalValue(psychoSocialRisk.nonCompliance),
    social: parseOptionalValue(psychoSocialRisk.social),
    migration: parseOptionalValue(psychoSocialRisk.migration),
    otherRisk: parseOptionalValue(psychoSocialRisk.otherRisk),
  };
}

function parseSocioEducationalPerformance(
  socioEducational: ApiSocioEducationalPerformance,
): SocioEducationalFieldsValues {
  return {
    reIntroduction: parseOptionalValue(socioEducational.reIntroduction),
    schoolCounselling: parseOptionalValue(socioEducational.schoolCounselling),
    motorPromotion: parseOptionalValue(socioEducational.motorPromotion),
    educationalAdvice: parseOptionalValue(socioEducational.educationalAdvice),
    languageAdvice: parseOptionalValue(socioEducational.languageAdvice),
    nutritionalAdvice: parseOptionalValue(socioEducational.nutritionalAdvice),
    vaccinationAdvice: parseOptionalValue(socioEducational.vaccinationAdvice),
    socialService: parseOptionalValue(socioEducational.socialService),
    otherSupport: parseOptionalValue(socioEducational.otherSupport),
    infoLetter: parseOptionalValue(socioEducational.infoLetter),
  };
}

function parseExaminationResultWithDiagnosis(
  resultWithDiagnosis: ApiExaminationWithDiagnosis | undefined,
): ExaminationWithDiagnosisFieldValues {
  return {
    examinationResult: {
      examinationResultValue: parseOptionalValue(
        resultWithDiagnosis?.examinationResult?.examinationResultValue,
      ),
      doctorLetterValue: parseOptionalValue(
        resultWithDiagnosis?.examinationResult?.doctorLetterValue,
      ),
    },
    icd10Codes: resultWithDiagnosis?.icd10Codes ?? [],
  };
}

function mapToRequest(
  procedureId: string,
  formValues: DevelopmentScreeningFormValues,
  version: number,
): UpdateDevelopmentScreeningResultRequest {
  return {
    procedureId,
    apiDevelopmentScreeningResult: {
      version,
      measurements: mapMeasurements(formValues.measurements),
      physicalExamination: mapPhysicalExamination(
        formValues.physicalExamination,
      ),
      handicap: mapHandicap(formValues.handicap),
      psychoSocialRisk: mapPsychoSocialRisk(formValues.psychoSocialRisk),
      socioEducationalPerformance: mapSocioEducationalPerformance(
        formValues.socioEducationalPerformance,
      ),
      extraEffort: mapOptionalValue(formValues.extraEffort),
      schoolFeedback: mapOptionalValue(formValues.schoolFeedback),
      schoolRecommendation: mapOptionalValue(formValues.schoolRecommendation),
    },
  };
}

function mapMeasurements(
  measurements: MeasurementFieldsValues,
): ApiMeasurements {
  return {
    height: mapOptionalValue(measurements.height),
    weight: mapOptionalValue(measurements.weight),
    systole: mapOptionalValue(measurements.systole),
    diastole: mapOptionalValue(measurements.diastole),
  };
}

function mapPhysicalExamination(
  physicalExamination: PhysicalExaminationFieldsValues,
): ApiPhysicalExamination {
  return {
    nutritionalCondition: mapExaminationResultWithDiagnosis(
      physicalExamination.nutritionalCondition,
    ),
    neurology: mapExaminationResultWithDiagnosis(physicalExamination.neurology),
    respiratoryCardiovascular: mapExaminationResultWithDiagnosis(
      physicalExamination.respiratoryCardiovascular,
    ),
    skin: mapExaminationResultWithDiagnosis(physicalExamination.skin),
    musculatureSkeleton: mapExaminationResultWithDiagnosis(
      physicalExamination.musculatureSkeleton,
    ),
    metabolism: mapExaminationResultWithDiagnosis(
      physicalExamination.metabolism,
    ),
    abdomen: mapExaminationResultWithDiagnosis(physicalExamination.abdomen),
    earNoseThroat: mapExaminationResultWithDiagnosis(
      physicalExamination.earNoseThroat,
    ),
    note: mapOptionalValue(physicalExamination.note),
  };
}

function mapHandicapWithDiagnosis(
  handicapWithDiagnosis: HandicapWithDiagnosisFieldValues,
): ApiHandicapWithDiagnosis {
  return {
    result: mapOptionalValue(handicapWithDiagnosis.result),
    icd10Codes: handicapWithDiagnosis.icd10Codes,
  };
}

function mapHandicap(handicap: HandicapFieldsValues): ApiHandicap {
  return {
    chronicDisease: mapHandicapWithDiagnosis(handicap.chronicDisease),
    disability: mapHandicapWithDiagnosis(handicap.disability),
    disabilityType: mapOptionalValue(handicap.disabilityType),
    note: mapOptionalValue(handicap.note),
  };
}

function mapPsychoSocialRisk(
  psychoSocialRisk: PsychoSocialRiskFieldsValues,
): ApiPsychoSocialRisk {
  return {
    family: mapOptionalValue(psychoSocialRisk.family),
    nonCompliance: mapOptionalValue(psychoSocialRisk.nonCompliance),
    social: mapOptionalValue(psychoSocialRisk.social),
    migration: mapOptionalValue(psychoSocialRisk.migration),
    otherRisk: mapOptionalValue(psychoSocialRisk.otherRisk),
  };
}

function mapSocioEducationalPerformance(
  socioEducational: SocioEducationalFieldsValues,
): ApiSocioEducationalPerformance {
  return {
    reIntroduction: mapOptionalValue(socioEducational.reIntroduction),
    schoolCounselling: mapOptionalValue(socioEducational.schoolCounselling),
    motorPromotion: mapOptionalValue(socioEducational.motorPromotion),
    educationalAdvice: mapOptionalValue(socioEducational.educationalAdvice),
    languageAdvice: mapOptionalValue(socioEducational.languageAdvice),
    nutritionalAdvice: mapOptionalValue(socioEducational.nutritionalAdvice),
    vaccinationAdvice: mapOptionalValue(socioEducational.vaccinationAdvice),
    socialService: mapOptionalValue(socioEducational.socialService),
    otherSupport: mapOptionalValue(socioEducational.otherSupport),
    infoLetter: mapOptionalValue(socioEducational.infoLetter),
  };
}

function mapExaminationResultWithDiagnosis(
  resultWithDiagnosis: ExaminationWithDiagnosisFieldValues,
): ApiExaminationWithDiagnosis {
  return {
    examinationResult: {
      examinationResultValue: mapOptionalValue(
        resultWithDiagnosis.examinationResult.examinationResultValue,
      ),
      doctorLetterValue: mapOptionalValue(
        resultWithDiagnosis.examinationResult.doctorLetterValue,
      ),
    },
    icd10Codes: resultWithDiagnosis.icd10Codes,
  };
}
