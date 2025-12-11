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

export interface MeasurementParametersType {
  parent: { label: string; value: string };
  child: { label: string; value: string };
}

export interface InspectionSampleSidebarFormType {
  evaluatingActor?: {
    label: string;
    value: {
      id: string;
      type:
        | "InspectionSampleContactReference"
        | "InspectionSampleInspectedFacilityReference"
        | "InspectionSampleUserReference";
    };
  };
  evaluationType: ApiInspectionSampleEvaluationType;
  measurementParameters: MeasurementParametersType[];
  sampleNumber: string;
  pointOfWithdrawal: string;
  samplingActor?: {
    label: string;
    value: {
      id: string;
      type:
        | "InspectionSampleContactReference"
        | "InspectionSampleInspectedFacilityReference"
        | "InspectionSampleUserReference";
    };
  };
  timeOfEvaluation?: string;
  timeOfSampling?: string;
  typeOfSample: ApiInspectionSampleType;
}

export function makeCreateInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
): ApiCreateInspectionSampleRequest {
  return {
    ...makeInspectionSampleRequest(formValues),
    externalId: uuidv4(),
    measurementParameters: formValues.measurementParameters.map((param) => ({
      externalId: uuidv4(),
      parameterZid: param.parent.value,
      untersuchungsparameterZid: param?.child?.value,
    })),
  };
}

export function makeUpdateInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
): ApiUpdateInspectionSampleRequest {
  return {
    ...makeInspectionSampleRequest(formValues),
    measurementParametersToAdd: formValues.measurementParameters.map(
      (param) => ({
        externalId: uuidv4(),
        parameterZid: param.parent.value,
        untersuchungsparameterZid: param?.child?.value,
      }),
    ),
    measurementParametersToDelete: [],
  };
}

function createActor(input: {
  type: ApiCreateInspectionSampleRequestEvaluatingActor["type"];
  id?: string;
}): ApiCreateInspectionSampleRequestEvaluatingActor {
  switch (input.type) {
    case "InspectionSampleUserReference":
      return {
        type: input.type,
        userId: input.id!,
      };

    case "InspectionSampleContactReference":
      return {
        type: input.type,
        contactId: input.id!,
      };

    case "InspectionSampleInspectedFacilityReference":
      return {
        type: input.type,
        centralFileStateId: input.id!,
      };
  }
}

export function makeInspectionSampleRequest(
  formValues: InspectionSampleSidebarFormType,
) {
  return {
    evaluatingActor: createActor(formValues.evaluatingActor!.value),
    evaluationType: formValues.evaluationType,
    sampleNumber: formValues.sampleNumber,
    pointOfWithdrawal: formValues.pointOfWithdrawal,
    samplingActor: createActor(formValues.samplingActor!.value),
    timeOfEvaluation: formValues.timeOfEvaluation
      ? new Date(formValues.timeOfEvaluation)
      : undefined,
    timeOfSampling: formValues.timeOfSampling
      ? new Date(formValues.timeOfSampling)
      : undefined,
    typeOfSample: formValues.typeOfSample,
  };
}
