/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { v4 as uuidv4 } from "uuid";

import {
  ApiCreateInspectionSampleRequest,
  ApiCreateInspectionSampleRequestEvaluatingActor,
  ApiInspectionSampleEvaluationType,
  ApiInspectionSampleType,
  ApiUpdateInspectionSampleRequest,
} from "@eshg/inspection-api";

export interface InspectionSampleSidebarFormType {
  evaluatingActor?: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  evaluationType: ApiInspectionSampleEvaluationType;
  measurementParameters: string[];
  nameOfSamplingPoint?: string;
  pointOfWithdrawal: string;
  samplingActor: string; //ApiCreateInspectionSampleRequestEvaluatingActor;
  timeOfEvaluation?: string;
  timeOfSampling?: string;
  typeOfSample: ApiInspectionSampleType;
}

export function makeCreateInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
  userId: string,
): ApiCreateInspectionSampleRequest {
  return {
    ...makeInspectionSampleRequest(formValues, userId),
    externalId: uuidv4(),
    measurementParameters: formValues.measurementParameters.map((zid) => ({
      externalId: uuidv4(),
      uParameterZid: zid,
    })),
  };
}

export function makeUpdateInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
  userId: string,
): ApiUpdateInspectionSampleRequest {
  return {
    ...makeInspectionSampleRequest(formValues, userId),
    measurementParametersToAdd: formValues.measurementParameters.map((zid) => ({
      externalId: uuidv4(),
      uParameterZid: zid,
    })),
    measurementParametersToDelete: [],
  };
}

export function makeInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
  userId: string,
) {
  return {
    evaluatingActor: {
      type: "InspectionSampleUserReference",
      userId,
    } as ApiCreateInspectionSampleRequestEvaluatingActor,
    evaluationType: formValues.evaluationType,
    nameOfSamplingPoint: formValues.nameOfSamplingPoint,
    pointOfWithdrawal: formValues.pointOfWithdrawal,
    samplingActor: {
      type: "InspectionSampleUserReference",
      userId,
    } as ApiCreateInspectionSampleRequestEvaluatingActor,
    timeOfEvaluation: formValues.timeOfEvaluation
      ? new Date(formValues.timeOfEvaluation)
      : undefined,
    timeOfSampling: formValues.timeOfSampling
      ? new Date(formValues.timeOfSampling)
      : undefined,
    typeOfSample: formValues.typeOfSample,
  };
}
