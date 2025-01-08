/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiTypeOfChange } from "@eshg/employee-portal-api/medicalRegistry";

type Section =
  | "profession"
  | "practice"
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
  employees: [
    ApiTypeOfChange.NewRegistration,
    ApiTypeOfChange.ReRegistration,
    ApiTypeOfChange.Other,
    ApiTypeOfChange.SecondPractice,
  ],
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

export function shouldEnable(
  section: Section,
  typeOfChange: ApiTypeOfChange | "",
): boolean {
  if (typeOfChange === "") {
    return true;
  }
  return sectionEnabled[section].includes(typeOfChange);
}
