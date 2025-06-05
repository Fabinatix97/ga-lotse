/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  YesOrNoFieldData,
  mapBoolToYesOrNo,
  mapOptionalValue,
  mapYesOrNoToBool,
} from "@eshg/lib-portal";
import {
  ApiRapidTestData,
  ApiRapidTestExamination,
} from "@eshg/sti-protection-api";

interface RapidTestData {
  number?: string;
  result: YesOrNoFieldData;
}

export interface RapidTestExaminationData {
  hivTestRequested: boolean;
  hivTestData: RapidTestData | null;
  syphilisTestRequested: boolean;
  syphilisTestData: RapidTestData | null;
  ultrasoundTestRequested: boolean;
  ultrasoundTestResult: string;
  pregnancyTestRequested: boolean;
  pregnancyTestData: RapidTestData | null;
  bloodPressureTestRequested: boolean;
  bloodPressureTestResult: string;
  pulseTestRequested: boolean;
  pulseTestResult: string;
  urineTestRequested: boolean;
  urineTestResult: string;
  generalRemarks: string;
  testsPayed: boolean;
}

function mapRapidTestToForm(testData?: ApiRapidTestData): RapidTestData {
  if (testData === undefined) {
    return {
      number: "",
      result: null,
    };
  }
  return {
    number: testData.number,
    result: mapBoolToYesOrNo(testData.result),
  };
}

function mapRapidTestToApi(
  formData: RapidTestData | null,
): ApiRapidTestData | undefined {
  if (formData === null) {
    return undefined;
  }

  const resultValue = mapYesOrNoToBool(formData.result);
  if (resultValue === undefined) {
    return undefined;
  }

  return {
    number: mapOptionalValue(formData.number?.trim()),
    result: resultValue,
  };
}

export function mapToFormValues(
  responseData: ApiRapidTestExamination,
): RapidTestExaminationData {
  return {
    hivTestRequested: responseData.hivRequested,
    hivTestData: mapRapidTestToForm(responseData.hivData),
    syphilisTestRequested: responseData.syphilisRequested,
    syphilisTestData: mapRapidTestToForm(responseData.syphilisData),
    ultrasoundTestRequested: responseData.ultrasoundRequested,
    ultrasoundTestResult: responseData.ultrasoundData ?? "",
    pregnancyTestRequested: responseData.pregnancyTestRequested,
    pregnancyTestData: mapRapidTestToForm(responseData.pregnancyTestData),
    bloodPressureTestRequested: responseData.bloodPressureRequested,
    bloodPressureTestResult: responseData.bloodPressureData ?? "",
    pulseTestRequested: responseData.pulseRequested,
    pulseTestResult: responseData.pulseData ?? "",
    urineTestRequested: responseData.urinalysisRequested,
    urineTestResult: responseData.urinalysisData ?? "",
    generalRemarks: responseData.generalComments ?? "",
    testsPayed: responseData.testsPayed,
  };
}

export function defaultRapidTestExaminationFormValues(): RapidTestExaminationData {
  return {
    hivTestRequested: false,
    hivTestData: mapRapidTestToForm(),
    syphilisTestRequested: false,
    syphilisTestData: mapRapidTestToForm(),
    ultrasoundTestRequested: false,
    ultrasoundTestResult: "",
    pregnancyTestRequested: false,
    pregnancyTestData: mapRapidTestToForm(),
    bloodPressureTestRequested: false,
    bloodPressureTestResult: "",
    pulseTestRequested: false,
    pulseTestResult: "",
    urineTestRequested: false,
    urineTestResult: "",
    generalRemarks: "",
    testsPayed: false,
  };
}

export function mapFormValuesToApi(
  values: RapidTestExaminationData,
): ApiRapidTestExamination {
  return {
    generalComments: values.generalRemarks ?? undefined,
    testsPayed: values.testsPayed,
    hivRequested: values.hivTestRequested,
    syphilisRequested: values.syphilisTestRequested,
    pregnancyTestRequested: values.pregnancyTestRequested,
    ultrasoundRequested: values.ultrasoundTestRequested,
    bloodPressureRequested: values.bloodPressureTestRequested,
    pulseRequested: values.pulseTestRequested,
    urinalysisRequested: values.urineTestRequested,
    hivData: values.hivTestRequested
      ? mapRapidTestToApi(values.hivTestData)
      : undefined,
    syphilisData: values.syphilisTestRequested
      ? mapRapidTestToApi(values.syphilisTestData)
      : undefined,
    pregnancyTestData: values.pregnancyTestRequested
      ? mapRapidTestToApi(values.pregnancyTestData)
      : undefined,
    ultrasoundData: values.ultrasoundTestRequested
      ? values.ultrasoundTestResult
      : undefined,
    bloodPressureData: values.bloodPressureTestRequested
      ? values.bloodPressureTestResult
      : undefined,
    pulseData: values.pulseTestRequested ? values.pulseTestResult : undefined,
    urinalysisData: values.urineTestRequested
      ? values.urineTestResult
      : undefined,
  };
}
