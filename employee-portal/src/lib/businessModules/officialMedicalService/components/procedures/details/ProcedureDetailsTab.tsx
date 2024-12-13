/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { AffectedPerson } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AffectedPerson";

interface ProcedureDetailsTabProps {
  procedureId: string;
}

export function ProcedureDetailsTab({
  procedureId,
}: Readonly<ProcedureDetailsTabProps>) {
  const { data: procedure } = useGetProcedureDetails(procedureId);

  return <AffectedPerson procedure={procedure} />;
}
