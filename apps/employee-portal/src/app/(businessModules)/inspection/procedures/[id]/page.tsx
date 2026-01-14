/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { DynamicPageProps } from "@eshg/lib-portal";

import { EditInspectionRouteParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default async function EditInspectionPage(
  props: DynamicPageProps<EditInspectionRouteParams>,
) {
  const { id } = await props.params;

  // if no tab name is given in the URL redirect to the "basedata" tab page
  redirect(routes.procedures.basedata(id));
}
