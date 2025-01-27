/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildDetails, ApiFluoridationConsent } from "@eshg/dental-api";
import {
  Versioned,
  mapVersioned,
} from "@eshg/lib-employee-portal/api/models/Versioned";

import { Child, mapChild } from "./Child";
import { Examination, mapExamination } from "./Examination";
import {
  AnnualInstitution,
  Institution,
  mapAnnualInstitutionDetails,
} from "./Institution";

export interface ChildDetails extends Child, Versioned {
  readonly examinations: Examination[];
  readonly institutions: AnnualInstitution[];
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
}

export function mapChildDetails(response: ApiChildDetails): ChildDetails {
  const institutions = response.institutions.map(mapAnnualInstitutionDetails);

  return {
    ...mapVersioned(response),
    ...mapChild({
      ...response,
      institution: getCurrentInstitution(institutions),
    }),
    institutions,
    examinations: response.examinations.map(mapExamination),
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
