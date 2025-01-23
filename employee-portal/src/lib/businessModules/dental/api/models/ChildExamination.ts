/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGender,
  ApiProphylaxisSessionChildExamination,
} from "@eshg/dental-api";

import {
  ExaminationStatus,
  mapToExaminationStatus,
} from "@/lib/businessModules/dental/api/models/ExaminationStatus";
import { mapOptional } from "@/lib/shared/api/models/utils";

import {
  ChildExaminationResult,
  mapChildExaminationResult,
} from "./ChildExaminationResult";

export interface ChildExamination {
  readonly childId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: Date;
  readonly groupName: string;
  readonly gender?: ApiGender;
  readonly fluoridationConsent?: boolean;
  readonly examinationResult?: ChildExaminationResult;
  readonly status: ExaminationStatus;
}

export function mapChildExamination(
  response: ApiProphylaxisSessionChildExamination,
): ChildExamination {
  return {
    ...response,
    status: mapToExaminationStatus(response.examinationResult),
    examinationResult: mapOptional(
      response.examinationResult,
      mapChildExaminationResult,
    ),
  };
}
