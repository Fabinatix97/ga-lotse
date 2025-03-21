/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { ApiGetCitizenProcedureDetailsResponse } from "@eshg/official-medical-service-api";
import { isDefined } from "remeda";

import { AnamnesisCard } from "@/lib/businessModules/officialMedicalService/components/personalArea/cards/AnamnesisCard";
import { AppointmentCard } from "@/lib/businessModules/officialMedicalService/components/personalArea/cards/AppointmentCard";
import { DepartmentCard } from "@/lib/businessModules/officialMedicalService/components/personalArea/cards/DepartmentCard";
import { DocumentsCard } from "@/lib/businessModules/officialMedicalService/components/personalArea/cards/DocumentsCard";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface PersonalAreaContentProps {
  procedure: ApiGetCitizenProcedureDetailsResponse;
}

export function PersonalAreaContent({ procedure }: PersonalAreaContentProps) {
  return (
    <GridColumnStack>
      {isDefined(procedure.appointment) && (
        <AppointmentCard appointment={procedure.appointment} />
      )}
      <AnamnesisCard />
      {isNonEmptyArray(procedure.documents) && (
        <DocumentsCard documents={procedure.documents} />
      )}
      <DepartmentCard />
    </GridColumnStack>
  );
}
