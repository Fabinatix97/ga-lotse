/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from "react-i18next";

import {
  ApiAddiction,
  ApiCurrentMedicalCondition,
  ApiEatingDisorder,
  ApiFillingPerson,
  ApiHeartDisease,
  ApiMaritalStatus,
  ApiMentalIllness,
  ApiOpticalAidAnswer,
  ApiThyroidDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

import { SelectOption } from "../../../components/formFields/SelectOptions";
import { i18nNamespace as libPortalNamespace } from "../../../i18n/namespace";

function useEnumOptions<TEnum extends string>(
  prefix: string,
  values: Record<TEnum, string>,
  allowDeselection = false,
): SelectOption[] {
  const { t } = useTranslation([
    "officialMedicalService/anamnesis",
    libPortalNamespace,
  ]);
  const result = Object.entries<string>(values).map(([, value]) => ({
    value,
    label: t(`content.${prefix}.values.${value}`),
  }));
  if (allowDeselection) {
    result.push({
      label: t("form.enumOptions.noSelection"),
      value: "",
    });
  }
  return result;
}

export function useBooleanWithUnknownOptions() {
  return useEnumOptions("booleanWithUnknown", ApiYesNoDontKnowAnswer, false);
}

export function useFillingPersonOptions(citizen: boolean) {
  const values = citizen
    ? Object.fromEntries(
        Object.entries(ApiFillingPerson).filter(
          ([, value]) => value !== ApiFillingPerson.Employee,
        ),
      )
    : ApiFillingPerson;
  return useEnumOptions("affectedPerson.fillingPerson", values, false);
}

export function useMaritalStatusOptions() {
  return useEnumOptions(
    "affectedPerson.maritalStatus",
    ApiMaritalStatus,
    false,
  );
}

export function useCurrentMedicalConditionOptions() {
  return useEnumOptions(
    "currentHealthCondition.currentMedicalConditionsInfo.descriptionOfCondition",
    ApiCurrentMedicalCondition,
    false,
  );
}

export function useOpticalAidOptions() {
  return useEnumOptions(
    "currentHealthCondition.opticalAidInfo.answer",
    ApiOpticalAidAnswer,
    false,
  );
}

export function useAddictionOptions() {
  return useEnumOptions(
    "medicalHistory.addictionsInfo.which",
    ApiAddiction,
    false,
  );
}

export function useEatingDisorderOptions() {
  return useEnumOptions(
    "medicalHistory.eatingDisorderInfo.which",
    ApiEatingDisorder,
    false,
  );
}

export function useHeartDiseaseOptions() {
  return useEnumOptions(
    "medicalHistory.heartDiseaseInfo.which",
    ApiHeartDisease,
    false,
  );
}

export function useMentalIllnessOptions() {
  return useEnumOptions(
    "medicalHistory.mentalIllnessInfo.which",
    ApiMentalIllness,
    false,
  );
}

export function useThyroidDiseaseOptions() {
  return useEnumOptions(
    "medicalHistory.thyroidInfo.which",
    ApiThyroidDisease,
    false,
  );
}
