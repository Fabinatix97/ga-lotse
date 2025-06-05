/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateField, SingleAutocompleteField } from "@eshg/lib-portal";

import { User } from "@/lib/businessModules/travelMedicine/api/models/User";
import {
  createMedicalAssistantOptions,
  createPhysicianOptions,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";

export function AppliedByFields(
  props: Readonly<{
    allPhysicians: User[];
    allMedicalAssistants: User[];
  }>,
) {
  return (
    <>
      <DateField
        name="appliedAt"
        label="Datum"
        required="Bitte geben Sie ein Datum an"
      />
      <SingleAutocompleteField
        label="Durchführende(r) Arzt/Ärztin"
        name="physician"
        required="Bitte eine(n) Arzt/Ärztin auswählen"
        options={createPhysicianOptions(props.allPhysicians)}
      />
      <SingleAutocompleteField
        label="MFA"
        name="medicalAssistant"
        options={createMedicalAssistantOptions(props.allMedicalAssistants)}
      />
    </>
  );
}
