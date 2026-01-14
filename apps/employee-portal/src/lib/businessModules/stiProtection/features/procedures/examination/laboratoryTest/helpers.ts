/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isBoolean, isString } from "remeda";

import {
  YesOrNoFieldData,
  mapBoolToYesOrNo,
  mapOptionalString,
  mapYesOrNoToBool,
} from "@eshg/lib-portal";
import {
  ApiLaboratoryTestExamination,
  ApiLaboratoryTestExaminationLabTestDataInner,
} from "@eshg/sti-protection-api";

import {
  areAllValuesUndefined,
  getPropertyIf,
  guardValue,
} from "@/lib/businessModules/stiProtection/shared/helpers";

interface LaboratoryTestData {
  value: string;
  result: YesOrNoFieldData;
  remark: string;
  hadSyphilis?: boolean;
  otherTestName?: string;
}

const defaultLaboratoryTestFormData = {
  value: "",
  result: null,
  remark: "",
};

function mapApiLaboratoryTestToFormData(
  responseData: ApiLaboratoryTestExaminationLabTestDataInner | undefined,
): LaboratoryTestData {
  if (responseData === undefined) {
    return defaultLaboratoryTestFormData;
  }
  return {
    value: responseData.value ?? "",
    result: mapBoolToYesOrNo(responseData.result),
    remark: responseData.remark ?? "",
    otherTestName: getPropertyIf(responseData, "otherTestName", isString),
    hadSyphilis: getPropertyIf(responseData, "hadSyphilis", isBoolean) ?? false,
  };
}

type LaboratorySampleTestResponseData =
  ApiLaboratoryTestExaminationLabTestDataInner & {
    oral?: boolean;
    urethral?: boolean;
    anal?: boolean;
  };
function mapApiLaboratorySampleTestToFormData(
  responseData: LaboratorySampleTestResponseData | undefined,
): LaboratoryTestSamplesData {
  const values = mapApiLaboratoryTestToFormData(responseData);
  return {
    ...values,
    oralSampleRequested: responseData?.oral ?? false,
    urethralSampleRequested: responseData?.urethral ?? false,
    analSampleRequested: responseData?.anal ?? false,
  };
}
const defaultLaboratoryImmunityTestFormData = {
  ...defaultLaboratoryTestFormData,
  vaccineTitre: false,
  infection: false,
};
type LaboratoryImmunityTestResponseData =
  ApiLaboratoryTestExaminationLabTestDataInner & {
    vaccineTitre?: boolean;
    infection?: boolean;
  };
function mapApiLaboratoryImmunityTestToFormData(
  responseData: LaboratoryImmunityTestResponseData | undefined,
): LaboratoryTestImmunityData {
  const values = mapApiLaboratoryTestToFormData(responseData);
  return {
    ...values,
    vaccineTitre: responseData?.vaccineTitre ?? false,
    infection: responseData?.infection ?? false,
  };
}

function mapLaboratoryTestFormDataToApi<
  T extends ApiLaboratoryTestExaminationLabTestDataInner,
>(type: T["type"], formData: LaboratoryTestData | null): T | undefined {
  if (formData === null) {
    return undefined;
  }

  let mappedValues = {
    type,
    value: mapOptionalString(formData.value),
    result: mapYesOrNoToBool(formData.result ?? ""),
    remark: mapOptionalString(formData.remark),
  } as T;
  if (type === "SyphilisTest") {
    mappedValues = {
      ...mappedValues,
      hadSyphilis: formData.hadSyphilis ?? false,
    };
  }
  if (type === "OtherTests") {
    mappedValues = {
      ...mappedValues,
      otherTestName: mapOptionalString(formData.otherTestName),
    };
  }

  if (areAllValuesUndefined(mappedValues)) {
    return;
  }
  return mappedValues;
}
type ApiLaboratoryTestVariant<T> = T &
  ApiLaboratoryTestExaminationLabTestDataInner;
type ApiLaboratoryImmunityTest = ApiLaboratoryTestVariant<{
  vaccineTitre?: boolean;
  infected?: boolean;
}>;
type ApiLaboratorySamplesTest = ApiLaboratoryTestVariant<{
  oral?: boolean;
  urethral?: boolean;
  anal?: boolean;
}>;

function mapLaboratoryImmunityTestFormDataToApi<
  T extends ApiLaboratoryImmunityTest,
>(type: T["type"], formData: LaboratoryTestImmunityData | null): T | undefined {
  if (formData === null) {
    return;
  }
  const values = mapLaboratoryTestFormDataToApi(type, formData);
  return {
    ...values,
    vaccineTitre: formData.vaccineTitre,
    infection: formData.infection,
  } as T;
}

function mapLaboratorySamplesTestFormDataToApi<
  T extends ApiLaboratorySamplesTest,
>(type: T["type"], formData: LaboratoryTestSamplesData | null): T | undefined {
  const values = mapLaboratoryTestFormDataToApi(type, formData);
  return {
    type,
    ...values,
    oral: formData?.oralSampleRequested,
    urethral: formData?.urethralSampleRequested,
    anal: formData?.analSampleRequested,
  } as T;
}

interface LaboratoryTestSamplesData extends LaboratoryTestData {
  oralSampleRequested: boolean;
  urethralSampleRequested: boolean;
  analSampleRequested: boolean;
}

interface LaboratoryTestImmunityData extends LaboratoryTestData {
  vaccineTitre: boolean;
  infection: boolean;
}

const defaultLaboratoryTestSamplesFormData = {
  ...defaultLaboratoryTestFormData,
  oralSampleRequested: false,
  oralSampleData: defaultLaboratoryTestFormData,
  urethralSampleRequested: false,
  urethralSampleData: defaultLaboratoryTestFormData,
  analSampleRequested: false,
  analSampleData: defaultLaboratoryTestFormData,
};

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
  hepATestData: LaboratoryTestImmunityData | null;
  hepBTestData: LaboratoryTestImmunityData | null;
  hepCTestData: LaboratoryTestData | null;
  chlamydiaTestData: LaboratoryTestSamplesData | null;
  gonorrheaTestData: LaboratoryTestSamplesData | null;
  mycoplasmaTestData: LaboratoryTestSamplesData | null;
  cancerScreeningTestData: LaboratoryTestData | null;
  hpvTestData: LaboratoryTestData | null;
  mpoxTestData: LaboratoryTestData | null;
  otherTestData: LaboratoryTestData | null;
}

export function mapToFormValues(
  responseData: ApiLaboratoryTestExamination,
): LaboratoryTestExaminationData {
  const labTestData = responseData.labTestData ?? [];
  const foundTestData = {
    hivTest: labTestData.find((t) => t.type === "HivTest"),
    syphilisTest: labTestData.find((t) => t.type === "SyphilisTest"),
    hepATest: labTestData.find((t) => t.type === "HepatitisATest"),
    hepBTest: labTestData.find((t) => t.type === "HepatitisBTest"),
    hepCTest: labTestData.find((t) => t.type === "HepatitisCTest"),
    chlamydiaTest: labTestData.find((t) => t.type === "ChlamydiaTest"),
    gonorrheaTest: labTestData.find((t) => t.type === "GonorrheaTest"),
    mycoplasmaTest: labTestData.find((t) => t.type === "MycoplasmaTest"),
    cancerScreeningTest: labTestData.find(
      (t) => t.type === "CancerScreeningTest",
    ),
    hpvTest: labTestData.find((t) => t.type === "HpvTest"),
    mpoxTest: labTestData.find((t) => t.type === "MpoxTest"),
    otherTest: labTestData.find((t) => t.type === "OtherTests"),
  };
  return {
    sampleBarcode: responseData.sampleBarcode ?? "",
    generalRemarks: responseData.generalRemarks ?? "",
    testsConducted: responseData.testsConducted ?? false,
    testsPayed: responseData.testsPayed ?? false,
    //Requested Tests
    //
    hivTestRequested: foundTestData.hivTest !== undefined,
    syphilisTestRequested: foundTestData.syphilisTest !== undefined,
    hepATestRequested: foundTestData.hepATest !== undefined,
    hepBTestRequested: foundTestData.hepBTest !== undefined,
    hepCTestRequested: foundTestData.hepCTest !== undefined,
    chlamydiaTestRequested: foundTestData.chlamydiaTest !== undefined,
    gonorrheaTestRequested: foundTestData.gonorrheaTest !== undefined,
    mycoplasmaTestRequested: foundTestData.mycoplasmaTest !== undefined,
    cancerScreeningTestRequested:
      foundTestData.cancerScreeningTest !== undefined,
    hpvTestRequested: foundTestData.hpvTest !== undefined,
    mpoxTestRequested: foundTestData.mpoxTest !== undefined,
    otherTestRequested: foundTestData.otherTest !== undefined,

    //Data of Tests
    hivTestData: mapApiLaboratoryTestToFormData(foundTestData.hivTest),
    syphilisTestData: mapApiLaboratoryTestToFormData(
      foundTestData.syphilisTest,
    ),
    hepATestData: mapApiLaboratoryImmunityTestToFormData(
      foundTestData.hepATest,
    ),
    hepBTestData: mapApiLaboratoryImmunityTestToFormData(
      foundTestData.hepBTest,
    ),
    hepCTestData: mapApiLaboratoryTestToFormData(foundTestData.hepCTest),
    chlamydiaTestData: mapApiLaboratorySampleTestToFormData(
      foundTestData.chlamydiaTest,
    ),
    gonorrheaTestData: mapApiLaboratorySampleTestToFormData(
      foundTestData.gonorrheaTest,
    ),
    mycoplasmaTestData: mapApiLaboratorySampleTestToFormData(
      foundTestData.mycoplasmaTest,
    ),
    cancerScreeningTestData: mapApiLaboratoryTestToFormData(
      foundTestData.cancerScreeningTest,
    ),
    hpvTestData: mapApiLaboratoryTestToFormData(foundTestData.hpvTest),
    mpoxTestData: mapApiLaboratoryTestToFormData(foundTestData.mpoxTest),
    otherTestData: mapApiLaboratoryTestToFormData(foundTestData.otherTest),
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
    hepATestData: defaultLaboratoryImmunityTestFormData,
    hepBTestData: defaultLaboratoryImmunityTestFormData,
    hepCTestData: defaultLaboratoryTestFormData,
    chlamydiaTestData: defaultLaboratoryTestSamplesFormData,
    gonorrheaTestData: defaultLaboratoryTestSamplesFormData,
    mycoplasmaTestData: defaultLaboratoryTestSamplesFormData,
    cancerScreeningTestData: defaultLaboratoryTestFormData,
    hpvTestData: defaultLaboratoryTestFormData,
    mpoxTestData: defaultLaboratoryTestFormData,
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
    //Data of Tests
    labTestData: [
      guardValue(
        formData.hivTestRequested,
        mapLaboratoryTestFormDataToApi("HivTest", formData.hivTestData),
      ),
      guardValue(
        formData.syphilisTestRequested,
        mapLaboratoryTestFormDataToApi(
          "SyphilisTest",
          formData.syphilisTestData,
        ),
      ),
      guardValue(
        formData.hepATestRequested,
        mapLaboratoryImmunityTestFormDataToApi(
          "HepatitisATest",
          formData.hepATestData,
        ),
      ),
      guardValue(
        formData.hepBTestRequested,
        mapLaboratoryImmunityTestFormDataToApi(
          "HepatitisBTest",
          formData.hepBTestData,
        ),
      ),
      guardValue(
        formData.hepCTestRequested,
        mapLaboratoryTestFormDataToApi("HepatitisCTest", formData.hepCTestData),
      ),
      guardValue(
        formData.chlamydiaTestRequested,
        mapLaboratorySamplesTestFormDataToApi(
          "ChlamydiaTest",
          formData.chlamydiaTestData,
        ),
      ),
      guardValue(
        formData.gonorrheaTestRequested,
        mapLaboratorySamplesTestFormDataToApi(
          "GonorrheaTest",
          formData.gonorrheaTestData,
        ),
      ),
      guardValue(
        formData.mycoplasmaTestRequested,
        mapLaboratorySamplesTestFormDataToApi(
          "MycoplasmaTest",
          formData.mycoplasmaTestData,
        ),
      ),
      guardValue(
        formData.cancerScreeningTestRequested,
        mapLaboratoryTestFormDataToApi(
          "CancerScreeningTest",
          formData.cancerScreeningTestData,
        ),
      ),
      guardValue(
        formData.hpvTestRequested,
        mapLaboratoryTestFormDataToApi("HpvTest", formData.hpvTestData),
      ),
      guardValue(
        formData.mpoxTestRequested,
        mapLaboratoryTestFormDataToApi("MpoxTest", formData.mpoxTestData),
      ),
      guardValue(
        formData.otherTestRequested,
        mapLaboratoryTestFormDataToApi("OtherTests", formData.otherTestData),
      ),
    ].filter((t) => t !== undefined),
  };
}
