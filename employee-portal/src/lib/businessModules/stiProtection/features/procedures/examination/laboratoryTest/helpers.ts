/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiHepatitisLaboratoryTest,
  ApiLaboratoryTest,
  ApiLaboratoryTestExamination,
  ApiLaboratoryTestSamples,
} from "@eshg/sti-protection-api";

import {
  YesOrNoFieldData,
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";
import {
  areAllValuesUndefined,
  guardValue,
  mapOptionalBool,
  mapOptionalString,
} from "@/lib/businessModules/stiProtection/shared/helpers";

export interface LaboratoryTestData {
  value: string;
  result: YesOrNoFieldData;
  remark: string;
}

export const defaultLaboratoryTestFormData = {
  value: "",
  result: null,
  remark: "",
};

export function mapApiLaboratoryTestToFormData(
  responseData: ApiLaboratoryTest | undefined,
): LaboratoryTestData {
  if (responseData === undefined) {
    return defaultLaboratoryTestFormData;
  }
  return {
    value: responseData.value ?? "",
    result: mapBoolToYesOrNo(responseData.result),
    remark: responseData.remark ?? "",
  };
}

export function mapLaboratoryTestFormDataToApi(
  formData: LaboratoryTestData | null,
): ApiLaboratoryTest | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    value: mapOptionalString(formData.value),
    result: mapYesOrNoToBool(formData.result ?? ""),
    remark: mapOptionalString(formData.remark),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface HepatitisLaboratoryTestData extends LaboratoryTestData {
  infection?: boolean;
  vaccineTitre?: boolean;
}

export const defaultHepatitisLaboratoryTestFormData = {
  infection: false,
  vaccineTitre: false,
  value: "",
  result: null,
  remark: "",
};

export function mapApiHepatitisLaboratoryTestToFormData(
  responseData: ApiHepatitisLaboratoryTest | undefined,
): HepatitisLaboratoryTestData {
  if (responseData === undefined) {
    return defaultHepatitisLaboratoryTestFormData;
  }
  return {
    infection: responseData.infection ?? false,
    vaccineTitre: responseData.vaccineTitre ?? false,
    value: responseData.value ?? "",
    result: mapBoolToYesOrNo(responseData.result),
    remark: responseData.remark ?? "",
  };
}

export function mapHepatitisLaboratoryTestFormDataToApi(
  formData: HepatitisLaboratoryTestData | null,
): ApiHepatitisLaboratoryTest | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    infection: mapOptionalBool(formData.infection),
    vaccineTitre: mapOptionalBool(formData.vaccineTitre),
    value: mapOptionalString(formData.value),
    result: mapYesOrNoToBool(formData.result ?? ""),
    remark: mapOptionalString(formData.remark),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface LaboratoryTestSamplesData {
  oralSampleRequested: boolean;
  oralSampleData: LaboratoryTestData;
  urethralSampleRequested: boolean;
  urethralSampleData: LaboratoryTestData;
  analSampleRequested: boolean;
  analSampleData: LaboratoryTestData;
}

export const defaultLaboratoryTestSamplesFormData = {
  oralSampleRequested: false,
  oralSampleData: defaultLaboratoryTestFormData,
  urethralSampleRequested: false,
  urethralSampleData: defaultLaboratoryTestFormData,
  analSampleRequested: false,
  analSampleData: defaultLaboratoryTestFormData,
};

export function mapApiLaboratoryTestSamplesToFormData(
  responseData: ApiLaboratoryTestSamples | undefined,
): LaboratoryTestSamplesData {
  if (responseData === undefined) {
    return defaultLaboratoryTestSamplesFormData;
  }

  return {
    oralSampleRequested: responseData.oralSampleRequested ?? false,
    oralSampleData: mapApiLaboratoryTestToFormData(responseData.oralSampleData),
    urethralSampleRequested: responseData.urethralSampleRequested ?? false,
    urethralSampleData: mapApiLaboratoryTestToFormData(
      responseData.urethralSampleData,
    ),
    analSampleRequested: responseData.analSampleRequested ?? false,
    analSampleData: mapApiLaboratoryTestToFormData(responseData.analSampleData),
  };
}

export function mapLaboratoryTestSamplesFormDataToApi(
  formData: LaboratoryTestSamplesData | null,
): ApiLaboratoryTestSamples | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    oralSampleRequested: mapOptionalBool(formData.oralSampleRequested),
    oralSampleData: guardValue(
      formData.oralSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.oralSampleData),
    ),
    urethralSampleRequested: mapOptionalBool(formData.urethralSampleRequested),
    urethralSampleData: guardValue(
      formData.urethralSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.urethralSampleData),
    ),
    analSampleRequested: mapOptionalBool(formData.analSampleRequested),
    analSampleData: guardValue(
      formData.analSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.analSampleData),
    ),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface LaboratoryTestExaminationData {
  sampleBarcode?: string;
  generalRemarks?: string;
  testsConducted?: boolean;
  testsPayed?: boolean;
  //Requested Tests
  hivTestRequested?: boolean;
  syphilisTestRequested?: boolean;
  hepATestRequested?: boolean;
  hepBTestRequested?: boolean;
  hepCTestRequested?: boolean;
  chlamydiaTestRequested?: boolean;
  gonorrheaTestRequested?: boolean;
  mycoplasmaTestRequested?: boolean;
  cancerScreeningTestRequested?: boolean;
  hpvTestRequested?: boolean;
  mpoxTestRequested?: boolean;
  otherTestRequested?: boolean;
  //Data of Tests
  hivTestData: LaboratoryTestData | null;
  syphilisTestData: LaboratoryTestData | null;
  hadSyphilis?: boolean;
  hepATestData: HepatitisLaboratoryTestData | null;
  hepBTestData: HepatitisLaboratoryTestData | null;
  hepCTestData: LaboratoryTestData | null;
  chlamydiaTestData: LaboratoryTestSamplesData | null;
  gonorrheaTestData: LaboratoryTestSamplesData | null;
  mycoplasmaTestData: LaboratoryTestSamplesData | null;
  cancerScreeningTestData: LaboratoryTestData | null;
  hpvTestData: LaboratoryTestData | null;
  mpoxTestData: LaboratoryTestData | null;
  otherTestName?: string;
  otherTestData: LaboratoryTestData | null;
}

export function mapToFormValues(
  responseData: ApiLaboratoryTestExamination,
): LaboratoryTestExaminationData {
  return {
    sampleBarcode: responseData.sampleBarcode ?? "",
    generalRemarks: responseData.generalRemarks ?? "",
    testsConducted: responseData.testsConducted ?? false,
    testsPayed: responseData.testsPayed ?? false,
    //Requested Tests
    hivTestRequested: responseData.hivTestRequested ?? false,
    syphilisTestRequested: responseData.syphilisTestRequested ?? false,
    hepATestRequested: responseData.hepATestRequested ?? false,
    hepBTestRequested: responseData.hepBTestRequested ?? false,
    hepCTestRequested: responseData.hepCTestRequested ?? false,
    chlamydiaTestRequested: responseData.chlamydiaTestRequested ?? false,
    gonorrheaTestRequested: responseData.gonorrheaTestRequested ?? false,
    mycoplasmaTestRequested: responseData.mycoplasmaTestRequested ?? false,
    cancerScreeningTestRequested:
      responseData.cancerScreeningTestRequested ?? false,
    hpvTestRequested: responseData.hpvTestRequested ?? false,
    mpoxTestRequested: responseData.mpoxTestRequested ?? false,
    otherTestRequested: responseData.otherTestRequested ?? false,
    //Data of Tests
    hivTestData: mapApiLaboratoryTestToFormData(responseData.hivTestData),
    syphilisTestData: mapApiLaboratoryTestToFormData(
      responseData.syphilisTestData,
    ),
    hadSyphilis: responseData.hadSyphilis ?? false,
    hepATestData: mapApiHepatitisLaboratoryTestToFormData(
      responseData.hepATestData,
    ),
    hepBTestData: mapApiHepatitisLaboratoryTestToFormData(
      responseData.hepBTestData,
    ),
    hepCTestData: mapApiLaboratoryTestToFormData(responseData.hepCTestData),
    chlamydiaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.chlamydiaTestSamples,
    ),
    gonorrheaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.gonorrheaTestSamples,
    ),
    mycoplasmaTestData: mapApiLaboratoryTestSamplesToFormData(
      responseData.mycoplasmaTestSamples,
    ),
    cancerScreeningTestData: mapApiLaboratoryTestToFormData(
      responseData.cancerScreeningTestData,
    ),
    hpvTestData: mapApiLaboratoryTestToFormData(responseData.hpvTestData),
    mpoxTestData: mapApiLaboratoryTestToFormData(responseData.mpoxTestData),
    otherTestName: responseData.otherTestRequested
      ? (responseData.otherTestName ?? "")
      : "",
    otherTestData: mapApiLaboratoryTestToFormData(responseData.otherTestData),
  };
}

export function defaultLaboratoryTestExaminationFormValues(): LaboratoryTestExaminationData {
  return {
    sampleBarcode: "",
    generalRemarks: "",
    testsConducted: false,
    testsPayed: false,
    //Requested Tests
    hivTestRequested: false,
    syphilisTestRequested: false,
    hepATestRequested: false,
    hepBTestRequested: false,
    hepCTestRequested: false,
    chlamydiaTestRequested: false,
    gonorrheaTestRequested: false,
    mycoplasmaTestRequested: false,
    cancerScreeningTestRequested: false,
    hpvTestRequested: false,
    mpoxTestRequested: false,
    otherTestRequested: false,
    //Data of Tests
    hivTestData: defaultLaboratoryTestFormData,
    syphilisTestData: defaultLaboratoryTestFormData,
    hadSyphilis: false,
    hepATestData: defaultHepatitisLaboratoryTestFormData,
    hepBTestData: defaultHepatitisLaboratoryTestFormData,
    hepCTestData: defaultLaboratoryTestFormData,
    chlamydiaTestData: defaultLaboratoryTestSamplesFormData,
    gonorrheaTestData: defaultLaboratoryTestSamplesFormData,
    mycoplasmaTestData: defaultLaboratoryTestSamplesFormData,
    cancerScreeningTestData: defaultLaboratoryTestFormData,
    hpvTestData: defaultLaboratoryTestFormData,
    mpoxTestData: defaultLaboratoryTestFormData,
    otherTestName: "",
    otherTestData: defaultLaboratoryTestFormData,
  };
}

export function mapFormValuesToApi(
  formData: LaboratoryTestExaminationData,
): ApiLaboratoryTestExamination {
  return {
    sampleBarcode: mapOptionalString(formData.sampleBarcode),
    generalRemarks: mapOptionalString(formData.generalRemarks),
    testsConducted: formData.testsConducted ?? false,
    testsPayed: formData.testsPayed ?? false,
    //Requested Tests
    hivTestRequested: formData.hivTestRequested ?? false,
    syphilisTestRequested: formData.syphilisTestRequested ?? false,
    hepATestRequested: formData.hepATestRequested ?? false,
    hepBTestRequested: formData.hepBTestRequested ?? false,
    hepCTestRequested: formData.hepCTestRequested ?? false,
    chlamydiaTestRequested: formData.chlamydiaTestRequested ?? false,
    gonorrheaTestRequested: formData.gonorrheaTestRequested ?? false,
    mycoplasmaTestRequested: formData.mycoplasmaTestRequested ?? false,
    cancerScreeningTestRequested:
      formData.cancerScreeningTestRequested ?? false,
    hpvTestRequested: formData.hpvTestRequested ?? false,
    mpoxTestRequested: formData.mpoxTestRequested ?? false,
    otherTestRequested: formData.otherTestRequested ?? false,
    //Data of Tests
    hivTestData: guardValue(
      formData.hivTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hivTestData),
    ),
    syphilisTestData: guardValue(
      formData.syphilisTestRequested,
      mapLaboratoryTestFormDataToApi(formData.syphilisTestData),
    ),
    hadSyphilis: guardValue(
      formData.syphilisTestRequested,
      formData.hadSyphilis,
    ),
    hepATestData: guardValue(
      formData.hepATestRequested,
      mapHepatitisLaboratoryTestFormDataToApi(formData.hepATestData),
    ),
    hepBTestData: guardValue(
      formData.hepBTestRequested,
      mapHepatitisLaboratoryTestFormDataToApi(formData.hepBTestData),
    ),
    hepCTestData: guardValue(
      formData.hepCTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hepCTestData),
    ),
    chlamydiaTestSamples: guardValue(
      formData.chlamydiaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.chlamydiaTestData),
    ),
    gonorrheaTestSamples: guardValue(
      formData.gonorrheaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.gonorrheaTestData),
    ),
    mycoplasmaTestSamples: guardValue(
      formData.mycoplasmaTestRequested,
      mapLaboratoryTestSamplesFormDataToApi(formData.mycoplasmaTestData),
    ),
    cancerScreeningTestData: guardValue(
      formData.cancerScreeningTestRequested,
      mapLaboratoryTestFormDataToApi(formData.cancerScreeningTestData),
    ),
    hpvTestData: guardValue(
      formData.hpvTestRequested,
      mapLaboratoryTestFormDataToApi(formData.hpvTestData),
    ),
    mpoxTestData: guardValue(
      formData.mpoxTestRequested,
      mapLaboratoryTestFormDataToApi(formData.mpoxTestData),
    ),
    otherTestName: guardValue(
      formData.otherTestRequested,
      mapOptionalString(formData.otherTestName),
    ),
    otherTestData: guardValue(
      formData.otherTestRequested,
      mapLaboratoryTestFormDataToApi(formData.otherTestData),
    ),
  };
}
