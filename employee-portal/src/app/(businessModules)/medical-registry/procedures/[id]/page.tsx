/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { redirect } from "next/navigation";

import { routes } from "@/lib/businessModules/medicalRegistry/shared/routes";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type MedicalRegistryProcedureRouteParams = {
  id: string;
};

export default function MedicalRegistryProcedurePage(
  props: DynamicPageProps<MedicalRegistryProcedureRouteParams>,
) {
  const { id } = props.params;

  redirect(routes.procedures.byId(id).details);
}
