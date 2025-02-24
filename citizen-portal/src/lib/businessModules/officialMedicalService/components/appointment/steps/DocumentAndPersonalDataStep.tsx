/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AffectedPersonForm } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/AffectedPersonForm";
import { DocumentForm } from "@/lib/businessModules/officialMedicalService/components/appointment/steps/DocumentForm";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

export function DocumentAndPersonalDataStep() {
  return (
    <GridColumnStack>
      <DocumentForm />
      <AffectedPersonForm name="affectedPerson" />
    </GridColumnStack>
  );
}
