/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

import { EditInspectionPageParams } from "@/app/(businessModules)/inspection/procedures/[id]/layout";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export default function EditInspectionPage({
  params,
}: Readonly<{
  params: EditInspectionPageParams;
}>) {
  // if no tab name is given in the URL redirect to the "basedata" tab page
  redirect(routes.procedures.basedata(params.id));
}
