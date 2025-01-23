/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiChildDetails,
  ApiFluoridationConsent,
  ApiProcedureStatus,
} from "@eshg/dental-api";

import {
  AnnualInstitution,
  Institution,
  mapAnnualInstitutionDetails,
} from "@/lib/businessModules/dental/api/models/Institution";
import { mapBaseEntity } from "@/lib/shared/api/models/BaseEntity";

import { Child } from "./Child";
import { Examination, mapExamination } from "./Examination";

export interface ChildDetails extends Child {
  readonly version: number;
  readonly examinations: Examination[];
  readonly institutions: AnnualInstitution[];
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
}

export function mapChildDetails(response: ApiChildDetails): ChildDetails {
  const institutions = response.institutions.map(mapAnnualInstitutionDetails);

  return {
    ...mapBaseEntity(response),
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    dateOfBirth: response.dateOfBirth,
    year: response.year,
    groupName: response.groupName,
    isClosed: response.status == ApiProcedureStatus.Closed,
    version: response.version,
    institution: getCurrentInstitution(institutions),
    examinations: response.examinations.map(mapExamination),
    institutions: institutions,
    currentFluoridationConsent: getCurrentFluoridationConsent(
      response.fluoridationConsents,
    ),
    allFluoridationConsents: response.fluoridationConsents,
  };
}

function getCurrentInstitution(institutions: AnnualInstitution[]): Institution {
  return institutions.reduce((max, current) =>
    max.year > current.year ? max : current,
  ).institution;
}

function getCurrentFluoridationConsent(
  fluoridationConsent: ApiFluoridationConsent[],
) {
  return fluoridationConsent[0];
}
