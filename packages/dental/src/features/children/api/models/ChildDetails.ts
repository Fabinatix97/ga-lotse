/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildDetails, ApiFluoridationConsent } from "@eshg/dental-api";
import {
  ProcedureLabel,
  Versioned,
  mapVersioned,
} from "@eshg/lib-employee-portal";

import {
  AnnualInstitution,
  mapAnnualInstitution,
} from "../../../../api/models/AnnualInstitution";
import { Institution } from "../../../../api/models/Institution";

import { Child, mapChild } from "./Child";
import { ChildExamination, mapChildExamination } from "./ChildExamination";
import { PersonDetails, mapPersonDetails } from "./PersonDetails";

export interface ChildDetails extends Child, Versioned {
  readonly examinations: ChildExamination[];
  readonly institutions: AnnualInstitution[];
  readonly currentFluoridationConsent?: ApiFluoridationConsent;
  readonly allFluoridationConsents: ApiFluoridationConsent[];
  readonly personDetails: PersonDetails;
  readonly procedureLabels: ProcedureLabel[];
  readonly note?: string;
}

export function mapChildDetails(response: ApiChildDetails): ChildDetails {
  const institutions = response.institutions.map(mapAnnualInstitution);
  const currentFluoridationConsent = getCurrentFluoridationConsent(
    response.fluoridationConsents,
  );

  return {
    ...mapVersioned(response),
    ...mapChild({
      ...response,
      institution: getCurrentInstitution(institutions),
      fluoridationConsent: currentFluoridationConsent?.consented ?? "UNKNOWN",
    }),
    personDetails: mapPersonDetails(response),
    institutions,
    examinations: response.examinations.map(mapChildExamination),
    currentFluoridationConsent,
    allFluoridationConsents: response.fluoridationConsents,
    procedureLabels: response.procedureLabels,
    note: response.note,
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
