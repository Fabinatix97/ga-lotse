/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import {
  ApiDiagnosis,
  ApiIcd10Code,
  ApiTestType,
} from "@eshg/sti-protection-api";

import { formatDateTypeToISODate } from "@/lib/shared/helpers/dateTime";

export interface DiagnosisFormData {
  results: string;
  medications: MedicationFormData[];
  typesOfTests: ApiTestType[];
  otherTests: string;
  notes: string;
  resultsShared: boolean | undefined;
  selectedCodes?: string[];
  findings?: ApiIcd10Code[];
}

export interface MedicationFormData {
  name: string;
  dose: string;
  date: string;
}

export const API_DIAGNOSIS_TEST_LABELS = {
  [ApiTestType.WesternBlot]: "westernblot",
  [ApiTestType.P24]: "p24",
  [ApiTestType.Pcr]: "PCR",
  [ApiTestType.Other]: "Sonstiges",
} as const satisfies Record<ApiTestType, string>;
export const API_DIAGNOSIS_TEST_OPTIONS = Object.entries(
  API_DIAGNOSIS_TEST_LABELS,
).map(([value, label]) => ({
  value: value as ApiTestType,
  label,
})) satisfies SelectOption[];

export function mapApiToForm(api: ApiDiagnosis): DiagnosisFormData {
  return {
    results: api.results ?? "",
    medications:
      api.medications?.map((t) => ({
        name: t.name ?? "",
        dose: t.dose ?? "",
        date: ifDefined(t.prescriptionDate, formatDateTypeToISODate) ?? "",
      })) ?? [],
    typesOfTests: Array.from(api.testTypes ?? []),
    otherTests: api.otherTestTypeName ?? "",
    notes: api.generalRemarks ?? "",
    resultsShared: api.resultsCommunicated,
    findings: sortIcd10Codes(api.findings),
  };
}

export function mapFormToApi(data: DiagnosisFormData): ApiDiagnosis {
  return {
    results: mapOptionalValue(data.results),
    medications: data.medications.map((t) => ({
      name: t.name,
      dose: t.dose,
      prescriptionDate: new Date(t.date),
    })),
    testTypes: new Set(data.typesOfTests),
    otherTestTypeName: mapOptionalValue(data.otherTests),
    generalRemarks: mapOptionalValue(data.notes),
    resultsCommunicated: data.resultsShared ?? false,
    findings: data.findings ?? [],
  };
}

export function sortIcd10Codes(icd10Codes: ApiIcd10Code[] = []) {
  function compareByCode(a: ApiIcd10Code, b: ApiIcd10Code) {
    return a.code.localeCompare(b.code);
  }
  const groupCodes = icd10Codes
    .filter(({ isGroup }) => isGroup)
    .sort(compareByCode);
  const nonGroupCodes = icd10Codes
    .filter(({ isGroup }) => !isGroup)
    .sort(compareByCode);
  const groupPrioritizedCodes = [...groupCodes, ...nonGroupCodes];

  return groupPrioritizedCodes;
}
