/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTypeOfChange } from "@eshg/medical-registry-api";

type Section =
  | "profession"
  | "practice"
  | "employeeInfo"
  | "employees"
  | "optionalDocuments"
  | "practiceChoice";

const sectionEnabled: Record<Section, ApiTypeOfChange[]> = {
  profession: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
  ],
  practice: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
    ApiTypeOfChange.SecondPractice,
    ApiTypeOfChange.ChangeOfRegistration,
  ],
  employeeInfo: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
    ApiTypeOfChange.SecondPractice,
  ],
  employees: [ApiTypeOfChange.ChangeOfEmployees],
  optionalDocuments: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
  ],
  practiceChoice: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.ChangeOfName,
    ApiTypeOfChange.Relocation,
    ApiTypeOfChange.Deregistration,
    ApiTypeOfChange.Other,
  ],
};

export function shouldEnableSection(
  section: Section,
  typeOfChange: ApiTypeOfChange | "",
): boolean {
  if (typeOfChange === "") {
    return true;
  }
  return sectionEnabled[section].includes(typeOfChange);
}
