/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { OfficialMedicalServiceDetailsPageProps } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import { ProcedureDetailsTab } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProcedureDetailsTab";

export default function OfficialMedicalServiceProcedureDetailsPage(
  props: OfficialMedicalServiceDetailsPageProps,
) {
  return <ProcedureDetailsTab procedureId={props.params.id} />;
}
