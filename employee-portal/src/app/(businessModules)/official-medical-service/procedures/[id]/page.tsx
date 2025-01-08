/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { OfficialMedicalServiceDetailsPageProps } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

export default function OfficialMedicalServiceProcedureIndexPage(
  props: OfficialMedicalServiceDetailsPageProps,
) {
  redirect(routes.procedures.byId(props.params.id).details);
}
